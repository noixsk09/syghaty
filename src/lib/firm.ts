import { createClient } from "@/lib/supabase/server";
import type { FirmMember, LawFirm, Profile, UserRole } from "@/types/database";

export type SessionContext = {
  userId: string;
  email: string | null;
  profile: Profile | null;
  membership: FirmMember | null;
  firm: LawFirm | null;
  role: UserRole | null;
};

export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: membership } = await supabase
    .from("firm_members")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let firm: LawFirm | null = null;
  if (membership?.firm_id) {
    const { data } = await supabase
      .from("law_firms")
      .select("*")
      .eq("id", membership.firm_id)
      .maybeSingle();
    firm = data;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    profile,
    membership,
    firm,
    role: membership?.role ?? null,
  };
}

export async function requireSession() {
  const ctx = await getSessionContext();
  if (!ctx) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }
  return ctx;
}

export async function requireFirmSession() {
  const ctx = await requireSession();
  if (!ctx.firm || !ctx.membership || !ctx.role) {
    throw new Error("يجب إعداد المكتب أولاً.");
  }
  return {
    ...ctx,
    firm: ctx.firm,
    membership: ctx.membership,
    role: ctx.role,
  };
}
