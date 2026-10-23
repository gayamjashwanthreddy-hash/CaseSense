import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let serverClientInstance: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client using the privileged service-role key.
 * IMPORTANT: NEVER import or call this function in client components or browser bundles.
 * This client bypasses RLS and should only be used in trusted server contexts (e.g., API routes, SSR, background jobs).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (serverClientInstance) return serverClientInstance;

  if (supabaseUrl && supabaseServiceRoleKey && supabaseUrl.startsWith("http")) {
    try {
      serverClientInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return serverClientInstance;
    } catch (e) {
      console.warn("Could not initialize Supabase server client:", e);
      return null;
    }
  }

  return null;
}

export const isSupabaseServerConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseServiceRoleKey && supabaseUrl.startsWith("http"));
};
