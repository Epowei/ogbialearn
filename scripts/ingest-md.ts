// ========================================
// Markdown Ingest Script for RAG Knowledge Base
// ========================================
// Usage: npx tsx scripts/ingest-md.ts
//
// Reads the manually-extracted Ogbia Grammar Book markdown,
// chunks by page boundaries, generates embeddings,
// and stores in Supabase (pgvector).

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// --- Configuration ---
const MD_PATH = path.resolve(__dirname, "../../knowledge_base/ogbia_grammar.md");
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_BATCH_SIZE = 20;
const INSERT_BATCH_SIZE = 20;

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GOOGLE_API_KEY) {
  console.error("Missing: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface Chunk {
  content: string;
  metadata: { source: string; page?: number; chunkIndex: number; totalChunks?: number };
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/Ogbia Grammar Book for Beginners\.\.\.\n?/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function splitByPages(text: string): { page: number; content: string }[] {
  const pages: { page: number; content: string }[] = [];
  const pageRegex = /^## Page (\d+)/gm;
  let match;
  const splits: { page: number; start: number }[] = [];

  while ((match = pageRegex.exec(text)) !== null) {
    splits.push({ page: parseInt(match[1]), start: match.index });
  }

  for (let i = 0; i < splits.length; i++) {
    const start = splits[i].start;
    const end = i + 1 < splits.length ? splits[i + 1].start : text.length;
    const content = text.substring(start, end)
      .replace(/^## Page \d+\s*/, "")
      .replace(/^---\s*/gm, "")
      .trim();
    if (content.length > 30) {
      pages.push({ page: splits[i].page, content });
    }
  }
  return pages;
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + chunkSize;
    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf("\n\n", end);
      if (paragraphBreak > start + chunkSize * 0.3) {
        end = paragraphBreak;
      } else {
        const sentenceEnd = text.substring(start, end).search(/[.!?]\s+(?=[A-Z])/g);
        if (sentenceEnd > chunkSize * 0.3) end = start + sentenceEnd + 1;
      }
    }
    const chunk = text.substring(start, end).trim();
    if (chunk.length > 40) chunks.push(chunk);
    start = end - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

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
    if (response.status === 429) throw new Error("RATE_LIMITED");
    const error = await response.text();
    throw new Error(`Embedding API error (${response.status}): ${error}`);
  }
  const data = await response.json();
  return data.embeddings.map((e: { values: number[] }) => e.values);
}

async function processBatch<T, R>(
  items: T[], batchSize: number, processor: (batch: T[]) => Promise<R[]>, label: string
): Promise<R[]> {
  const results: R[] = [];
  const totalBatches = Math.ceil(items.length / batchSize);
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    console.log(`  ${label}: batch ${batchNum}/${totalBatches} (${batch.length} items)`);
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
          await new Promise((r) => setTimeout(r, waitSec * 1000));
        } else throw err;
      }
    }
    if (i + batchSize < items.length)
      await new Promise((r) => setTimeout(r, 1500));
  }
  return results;
}

async function main() {
  console.log("🔵 RAG Ingest Pipeline Starting...\n");

  // Step 1: Read markdown
  console.log("📄 Step 1: Reading markdown extraction...");
  if (!fs.existsSync(MD_PATH)) { console.error(`File not found: ${MD_PATH}`); process.exit(1); }
  const rawText = fs.readFileSync(MD_PATH, "utf-8");
  console.log(`   Raw: ${rawText.length.toLocaleString()} chars, ${rawText.split("\n").length} lines`);

  // Step 2: Split by pages and chunk
  console.log("\n✂️  Step 2: Splitting by pages and chunking...");
  const pages = splitByPages(rawText);
  console.log(`   Found ${pages.length} pages`);

  const allChunks: Chunk[] = [];
  let globalIndex = 0;
  for (const { page, content } of pages) {
    const cleaned = cleanText(content);
    const textChunks = chunkText(cleaned, CHUNK_SIZE, CHUNK_OVERLAP);
    for (const chunkContent of textChunks) {
      allChunks.push({
        content: chunkContent,
        metadata: { source: "Ogbia Grammar Book", page, chunkIndex: globalIndex++ },
      });
    }
  }
  for (const chunk of allChunks) chunk.metadata.totalChunks = allChunks.length;

  console.log(`   Total chunks: ${allChunks.length}`);
  if (allChunks.length > 0) {
    const totalChars = allChunks.reduce((sum, c) => sum + c.content.length, 0);
    console.log(`   Avg chunk size: ${Math.round(totalChars / allChunks.length)} chars`);
  }
  if (allChunks.length === 0) { console.error("No chunks created. Aborting."); process.exit(1); }

  // Step 3: Generate embeddings
  console.log("\n🧠 Step 3: Generating embeddings...");
  const embeddings = await processBatch(
    allChunks.map((c) => c.content), EMBEDDING_BATCH_SIZE, generateEmbeddings, "Embedding"
  );
  console.log(`   Embeddings generated: ${embeddings.length}`);

  // Step 4: Clear existing documents
  console.log("\n🗑️  Step 4: Clearing old documents...");
  const { error: deleteError } = await supabase.from("documents").delete().neq("id", 0);
  if (deleteError) console.log("   Note:", deleteError.message);
  else console.log("   Cleared old documents");

  // Step 5: Insert into Supabase
  console.log("\n💾 Step 5: Inserting into Supabase...");
  let inserted = 0, errors = 0;
  for (let i = 0; i < allChunks.length; i += INSERT_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + INSERT_BATCH_SIZE);
    const batchEmb = embeddings.slice(i, i + INSERT_BATCH_SIZE);
    const rows = batch.map((chunk, j) => ({
      content: chunk.content, metadata: chunk.metadata, embedding: JSON.stringify(batchEmb[j]),
    }));
    const { error } = await supabase.from("documents").insert(rows);
    if (error) { console.error(`   Insert error batch ${Math.floor(i / INSERT_BATCH_SIZE) + 1}:`, error.message); errors++; }
    else { inserted += batch.length; console.log(`   Inserted ${inserted}/${allChunks.length} documents`); }
    if (i + INSERT_BATCH_SIZE < allChunks.length) await new Promise((r) => setTimeout(r, 200));
  }

  if (errors > 0) console.log(`\n⚠️  Completed with ${errors} errors. ${inserted} documents inserted.`);
  else console.log(`\n✅ Done! ${inserted} document chunks ingested into Supabase.`);
  console.log("   The AI tutor can now search the Ogbia Grammar Book!\n");
}

main().catch((error) => { console.error("Fatal error:", error); process.exit(1); });