import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function testRAG(query: string) {
  console.log(`\n🔍 Query: "${query}"`);

  // Generate embedding
  const embUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GOOGLE_API_KEY}`;
  const embResp = await fetch(embUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/gemini-embedding-001",
      content: { parts: [{ text: query }] },
      taskType: "RETRIEVAL_QUERY",
      outputDimensionality: 768,
    }),
  });
  const embData = await embResp.json();
  const embedding = embData.embedding?.values;
  if (!embedding) { console.log("❌ Failed to embed query"); return; }

  // Search knowledge base
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: JSON.stringify(embedding),
    match_threshold: 0.3,
    match_count: 3,
  });

  if (error) { console.log("❌ Search error:", error.message); return; }
  if (!data?.length) { console.log("📭 No matching documents found"); return; }

  console.log(`✅ Found ${data.length} matches:`);
  for (const doc of data) {
    console.log(`\n   Similarity: ${doc.similarity.toFixed(3)}`);
    console.log(`   Content: ${doc.content.substring(0, 200)}...`);
  }
}

async function main() {
  await testRAG("How do you say hello in Ogbia?");
  await testRAG("What are the tones in Ogbia language?");
  await testRAG("Ogbia noun classes");
}
main();
