import { supabase } from "@/integrations/supabase/client";

export async function isAuthenticatedAsync(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export async function logout() {
  await supabase.auth.signOut();
}
