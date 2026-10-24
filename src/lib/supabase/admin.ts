/**
 * Supabase Admin Client — يستخدم service_role key لتجاوز RLS.
 * للخادم فقط — لا تستورد هذا الملف في أي مكون client-side.
 * استخدمه فقط بعد التحقق من هوية المستخدم يدوياً في الكود.
 */

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, getServiceRoleKey } from "./env";

export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = getServiceRoleKey();

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY غير مُعدَّة.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
