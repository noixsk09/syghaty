export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url: url?.trim() || "",
    anonKey: anonKey?.trim() || "",
    isConfigured: Boolean(url?.trim() && anonKey?.trim()),
  };
}

export function getServiceRoleKey() {
  // Server-only. Never import this module into client components.
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
}
