"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createClient() {
  const { url, anonKey, isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    throw new Error(
      "لم يتم إعداد Supabase. أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY إلى .env.local",
    );
  }
  return createBrowserClient(url, anonKey);
}
