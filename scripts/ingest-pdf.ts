// ========================================
// PDF Ingest Script for RAG Knowledge Base
// ========================================
// Usage: npx tsx scripts/ingest-pdf.ts
//
// Reads the Ogbia Grammar Book PDF (scanned/image-based),
// uses local Tesseract OCR (via pdftoppm + tesseract CLI),
// chunks the text, generates embeddings, and stores in Supabase (pgvector).

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

// Load .env.local first so env vars are available
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// --- Configuration ---
const PDF_PATH = path.resolve(__dirname, "../../Ogbia Grammar Book.pdf");
const TEMP_DIR = path.resolve(__dirname, "../.ocr-temp");
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_BATCH_SIZE = 20;
const INSERT_BATCH_SIZE = 20;

// --- Environment ---
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GOOGLE_API_KEY) {
  console.error("Missing required environment variables:");
  console.error("  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- Text Chunking ---
interface Chunk {
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks?: number;
    pages?: string;
  };
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\f/g, "\n\n")
    .trim();
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf("\n\n", end);
      if (paragraphBreak > start + chunkSize * 0.5) {
        end = paragraphBreak;
      } else {
        const sentenceEnd = text.substring(start, end).search(/[.!?]\s+(?=[A-Z])/g);
        if (sentenceEnd > chunkSize * 0.5) {
          end = start + sentenceEnd + 1;
        }
      }
    }

    const chunk = text.substring(start, end).trim();
    if (chunk.length > 50) {
      chunks.push(chunk);
    }

    start = end - overlap;
    if (start >= text.length) break;
  }

  return chunks;
}

// --- OCR via local Tesseract (no API rate limits!) ---
function ocrPdfLocally(pdfPath: string): string {
  // Create temp directory for page images
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  // Step 1: Convert PDF pages to images using pdftoppm
  console.log("   Converting PDF pages to images...");
  execSync(
    `pdftoppm -png -r 300 "${pdfPath}" "${TEMP_DIR}/page"`,
    { stdio: "inherit", timeout: 300000 }
  );

  // Get all generated page images, sorted
  const pageFiles = fs.readdirSync(TEMP_DIR)
    .filter((f) => f.endsWith(".png"))
    .sort();
  console.log(`   Generated ${pageFiles.length} page images`);

  // Step 2: OCR each page with Tesseract
  const allText: string[] = [];
  for (let i = 0; i < pageFiles.length; i++) {
    const pageFile = path.join(TEMP_DIR, pageFiles[i]);
    const pageNum = i + 1;
    process.stdout.write(`   OCR page ${pageNum}/${pageFiles.length}...\r`);

    try {
      const text = execSync(
        `tesseract "${pageFile}" stdout --psm 6 -l eng`,
        { encoding: "utf-8", timeout: 60000 }
      );
      allText.push(`--- PAGE ${pageNum} ---\n${text.trim()}`);
    } catch (err) {
      console.warn(`   Warning: OCR failed for page ${pageNum}, skipping`);
      allText.push(`--- PAGE ${pageNum} ---\n[OCR failed]`);
    }
  }
  console.log(`\n   OCR complete for ${pageFiles.length} pages`);

  // Cleanup temp files
  fs.rmSync(TEMP_DIR, { recursive: true });

  return allText.join("\n\n");
}

// --- Embedding Generation ---
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${GOOGLE_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: texts.map((text) => ({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: 768,
      })),
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      // Rate limited - caller should retry
      throw new Error(`RATE_LIMITED`);
    }
    const error = await response.text();
    throw new Error(`Embedding API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.embeddings.map((e: { values: number[] }) => e.values);
}

// --- Batch Processing Helper (with retry) ---
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>,
  label: string
): Promise<R[]> {
  const results: R[] = [];
  const totalBatches = Math.ceil(items.length / batchSize);

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    console.log(`  ${label}: batch ${batchNum}/${totalBatches} (${batch.length} items)`);

    // Retry logic for rate limits
    let retries = 0;
    while (retries < 5) {
      try {
        const batchResults = await processor(batch);
        results.push(...batchResults);
        break;
      } catch (err: any) {
        if (err.message === "RATE_LIMITED" && retries < 4) {
          retries++;
          const waitSec = retries * 15;
          console.log(`   Rate limited, waiting ${waitSec}s (retry ${retries}/4)...`);
          await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
        } else {
          throw err;
        }
      }
    }

    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return results;
}

// --- Main Ingest Pipeline ---
async function main() {
  console.log("🔵 RAG Ingest Pipeline Starting...\n");

  // Step 1: OCR the PDF using local Tesseract
  console.log("📄 Step 1: OCR with local Tesseract...");
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`File not found: ${PDF_PATH}`);
    process.exit(1);
  }

  const extractedText = ocrPdfLocally(PDF_PATH);
  console.log(`   Extracted ${extractedText.length.toLocaleString()} characters`);

  // Save extracted text for reference
  const textOutputPath = path.resolve(__dirname, "../extracted-text.txt");
  fs.writeFileSync(textOutputPath, extractedText);
  console.log(`   Saved extracted text to: extracted-text.txt`);

  // Step 2: Clean and chunk text
  console.log("\n✂️  Step 2: Chunking text...");
  const cleanedText = cleanText(extractedText);
  const textChunks = chunkText(cleanedText, CHUNK_SIZE, CHUNK_OVERLAP);
  console.log(`   Chunks created: ${textChunks.length}`);
  if (textChunks.length > 0) {
    console.log(`   Avg chunk size: ${Math.round(cleanedText.length / textChunks.length)} chars`);
  }

  if (textChunks.length === 0) {
    console.error("No text chunks created. Aborting.");
    process.exit(1);
  }

  const chunks: Chunk[] = textChunks.map((content, index) => ({
    content,
    metadata: {
      source: "Ogbia Grammar Book",
      chunkIndex: index,
      totalChunks: textChunks.length,
    },
  }));

  // Step 3: Generate embeddings
  console.log("\n🧠 Step 3: Generating embeddings...");
  const chunkContents = chunks.map((c) => c.content);
  const embeddings = await processBatch(
    chunkContents,
    EMBEDDING_BATCH_SIZE,
    generateEmbeddings,
    "Embedding"
  );
  console.log(`   Embeddings generated: ${embeddings.length}`);

  // Step 4: Clear existing documents
  console.log("\n🗑️  Step 4: Clearing old documents...");
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    console.log("   Note: Could not clear (table might be empty):", deleteError.message);
  } else {
    console.log("   Cleared old documents");
  }

  // Step 5: Insert into Supabase
  console.log("\n💾 Step 5: Inserting into Supabase...");

  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < chunks.length; i += INSERT_BATCH_SIZE) {
    const batch = chunks.slice(i, i + INSERT_BATCH_SIZE);
    const batchEmbeddings = embeddings.slice(i, i + INSERT_BATCH_SIZE);

    const rows = batch.map((chunk, j) => ({
      content: chunk.content,
      metadata: chunk.metadata,
      embedding: JSON.stringify(batchEmbeddings[j]),
    }));

    const { error } = await supabase.from("documents").insert(rows);

    if (error) {
      console.error(`   Insert error at batch ${Math.floor(i / INSERT_BATCH_SIZE) + 1}:`, error.message);
      errors++;
    } else {
      inserted += batch.length;
      console.log(`   Inserted ${inserted}/${chunks.length} documents`);
    }

    if (i + INSERT_BATCH_SIZE < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  if (errors > 0) {
    console.log(`\n⚠️  Completed with ${errors} batch errors. ${inserted} documents inserted.`);
  } else {
    console.log(`\n✅ Done! ${inserted} document chunks ingested into Supabase.`);
  }
  console.log("   The AI tutor can now search the Ogbia Grammar Book!\n");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
