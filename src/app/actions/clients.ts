"use server";

import { requireFirmSession } from "@/lib/firm";
import { assertPermission } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  const session = await requireFirmSession();
  assertPermission(session.role, "clients:write");

  const parsed = clientSchema.safeParse({
    full_name: formData.get("full_name"),
    national_id: formData.get("national_id") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    address: formData.get("address") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert({
    ...parsed.data,
    email: parsed.data.email || null,
    firm_id: session.firm.id,
    created_by: session.userId,
  });

  if (error) return { ok: false as const, error: "تعذر حفظ العميل." };

  await supabase.from("audit_logs").insert({
    firm_id: session.firm.id,
    actor_id: session.userId,
    action: "client.create",
    entity_type: "clients",
    metadata: { name: parsed.data.full_name },
  });

  revalidatePath("/clients");
  return { ok: true as const };
}

export async function archiveClientAction(clientId: string) {
  const session = await requireFirmSession();
  assertPermission(session.role, "clients:archive");
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", clientId)
    .eq("firm_id", session.firm.id);

  if (error) return { ok: false as const, error: "تعذر أرشفة العميل." };

  revalidatePath("/clients");
  return { ok: true as const };
}
