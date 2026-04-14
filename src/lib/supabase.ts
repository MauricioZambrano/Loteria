import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const CHANNEL_NAME = "loteria-game";
export const TABLE_NAME = "game_sessions";

// Lazy singleton — only instantiated when first called (never at import/build time)
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
      );
    }
    _client = createClient(url, key);
  }
  return _client;
}
