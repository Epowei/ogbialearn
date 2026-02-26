// ========================================
// Supabase Client (Server-side)
// ========================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Admin client (for server-side operations like ingestion)
export function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Public client (for read operations)
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
