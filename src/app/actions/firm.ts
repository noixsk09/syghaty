"use server";

import { requireSession } from "@/lib/firm";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { firmSetupSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createFirmAction(formData: FormData) {
  const parsed = firmSetupSchema.safeParse({
    name: formData.get("name"),
    tradeName: formData.get("tradeName") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  const session = await requireSession();
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: existing } = await supabase
    .from("firm_members")
    .select("id")
    .eq("user_id", session.userId)
    .eq("is_active", true)
    .maybeSingle();

  if (existing) {
    return { ok: false as const, error: "أنت مرتبط بمكتب بالفعل." };
  }

  const { data: firm, error: firmError } = await adminSupabase
    .from("law_firms")
    .insert({
      name: parsed.data.name,
      trade_name: parsed.data.tradeName || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      city: parsed.data.city || null,
      created_by: session.userId,
    })
    .select("id")
    .single();

  if (firmError || !firm) {
    return { ok: false as const, error: `تعذر إنشاء المكتب: ${firmError?.message ?? "لا يوجد بيانات"}` };
  }

  const { error: memberError } = await adminSupabase.from("firm_members").insert({
    firm_id: firm.id,
    user_id: session.userId,
    role: "owner",
    is_active: true,
    joined_at: new Date().toISOString(),
  });

  if (memberError) {
    return { ok: false as const, error: "تعذر ربطك كمالك للمكتب." };
  }

  await adminSupabase.from("audit_logs").insert({
    firm_id: firm.id,
    actor_id: session.userId,
    action: "firm.create",
    entity_type: "law_firms",
    entity_id: firm.id,
    metadata: { name: parsed.data.name },
  });

  revalidatePath("/");
  return { ok: true as const };
}
