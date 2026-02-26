// Temporary diagnostic endpoint - DELETE after debugging
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check environment variables
  results.env = {
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY ? `set (${process.env.GOOGLE_API_KEY?.substring(0, 8)}...)` : "MISSING",
    SUPABASE_URL: process.env.SUPABASE_URL || "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY ? `set (${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20)}...)` : "MISSING",
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY ? `set (${process.env.SUPABASE_ANON_KEY?.substring(0, 20)}...)` : "MISSING",
  };

  // 2. Test Supabase connection
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error, count } = await supabase
        .from("documents")
        .select("id", { count: "exact" })
        .limit(1);

      results.supabase_query = {
        success: !error,
        documentCount: count,
        sampleData: data,
        error: error?.message || null,
      };
    } catch (err) {
      results.supabase_query = { success: false, error: String(err) };
    }
  } else {
    results.supabase_query = { success: false, error: "Missing SUPABASE_URL or key" };
  }

  // 3. Test embedding API
  const apiKey = process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: "test ogbia language" }] },
          taskType: "RETRIEVAL_QUERY",
          outputDimensionality: 768,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const dims = data.embedding?.values?.length;
        results.embedding = { success: true, dimensions: dims };

        // 4. Test RPC match_documents with the real embedding
        if (supabaseUrl && supabaseKey && data.embedding?.values) {
          try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: matches, error } = await supabase.rpc("match_documents", {
              query_embedding: JSON.stringify(data.embedding.values),
              match_threshold: 0.3,
              match_count: 3,
            });

            results.rag_search = {
              success: !error,
              matchCount: matches?.length || 0,
              firstMatch: matches?.[0]
                ? {
                    similarity: matches[0].similarity,
                    contentPreview: matches[0].content?.substring(0, 100),
                  }
                : null,
              error: error?.message || null,
              errorDetails: error?.details || null,
              errorHint: error?.hint || null,
            };
          } catch (err) {
            results.rag_search = { success: false, error: String(err) };
          }
        }
      } else {
        const errText = await response.text();
        results.embedding = { success: false, status: response.status, error: errText.substring(0, 300) };
      }
    } catch (err) {
      results.embedding = { success: false, error: String(err) };
    }
  } else {
    results.embedding = { success: false, error: "Missing GOOGLE_API_KEY" };
  }

  return NextResponse.json(results, { status: 200 });
}
