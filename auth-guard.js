// auth-guard.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" }
});

export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // bounce back to login
    window.location.href = "index.html";
    throw new Error("Not authenticated");
  }
  return session;
}