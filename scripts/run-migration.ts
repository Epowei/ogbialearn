// ========================================
// Run SQL Migration Against Supabase
// ========================================
// Usage: npx tsx scripts/run-migration.ts

import postgres from "postgres";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set in .env.local");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  ssl: "require",
  connection: { application_name: "ogbialearn-migration" },
});

async function main() {
  console.log("🔵 Running RAG migration...\n");

  // 1. Enable pgvector
  console.log("  1. Enabling pgvector extension...");
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  console.log("     ✅ pgvector enabled");

  // 2. Create documents table
  console.log("  2. Creating documents table...");
  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id BIGSERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      embedding VECTOR(768),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("     ✅ documents table created");

  // 3. Create similarity search function
  console.log("  3. Creating match_documents function...");
  await sql`
    CREATE OR REPLACE FUNCTION match_documents(
      query_embedding VECTOR(768),
      match_threshold FLOAT DEFAULT 0.5,
      match_count INT DEFAULT 5
    )
    RETURNS TABLE (
      id BIGINT,
      content TEXT,
      metadata JSONB,
      similarity FLOAT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        documents.id,
        documents.content,
        documents.metadata,
        (1 - (documents.embedding <=> query_embedding))::FLOAT AS similarity
      FROM documents
      WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
      ORDER BY documents.embedding <=> query_embedding
      LIMIT match_count;
    END;
    $$
  `;
  console.log("     ✅ match_documents function created");

  console.log("\n✅ Migration complete!\n");
  await sql.end();
}

main().catch(async (err) => {
  console.error("Migration failed:", err);
  await sql.end();
  process.exit(1);
});
