"use server";

import { requireFirmSession } from "@/lib/firm";
import { assertPermission } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { caseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createCaseAction(formData: FormData) {
  const session = await requireFirmSession();
  assertPermission(session.role, "cases:write");

  const parsed = caseSchema.safeParse({
    title: formData.get("title"),
    client_id: formData.get("client_id"),
    case_number: formData.get("case_number") || undefined,
    case_year: formData.get("case_year") || undefined,
    court_name: formData.get("court_name") || undefined,
    circuit: formData.get("circuit") || undefined,
    case_type: formData.get("case_type") || undefined,
    status: formData.get("status") || "open",
    opponent_name: formData.get("opponent_name") || undefined,
    subject: formData.get("subject") || undefined,
    responsible_lawyer_id: formData.get("responsible_lawyer_id") || undefined,
    filed_at: formData.get("filed_at") || undefined,
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("id", parsed.data.client_id)
    .eq("firm_id", session.firm.id)
    .is("archived_at", null)
    .maybeSingle();

  if (!client) {
    return { ok: false as const, error: "العميل غير موجود داخل مكتبك." };
  }

  const { data: created, error } = await supabase
    .from("cases")
    .insert({
      firm_id: session.firm.id,
      client_id: parsed.data.client_id,
      title: parsed.data.title,
      case_number: parsed.data.case_number || null,
      case_year: parsed.data.case_year ?? null,
      court_name: parsed.data.court_name || null,
      circuit: parsed.data.circuit || null,
      case_type: parsed.data.case_type || null,
      status: parsed.data.status,
      opponent_name: parsed.data.opponent_name || null,
      subject: parsed.data.subject || null,
      responsible_lawyer_id: parsed.data.responsible_lawyer_id || null,
      filed_at: parsed.data.filed_at || null,
      created_by: session.userId,
    })
    .select("id")
    .single();

  if (error || !created) return { ok: false as const, error: "تعذر إنشاء القضية." };

  await supabase.from("case_events").insert({
    firm_id: session.firm.id,
    case_id: created.id,
    title: "إنشاء القضية",
    details: parsed.data.title,
    created_by: session.userId,
  });

  revalidatePath("/cases");
  return { ok: true as const, id: created.id };
}

export async function archiveCaseAction(caseId: string) {
  const session = await requireFirmSession();
  assertPermission(session.role, "cases:archive");
  const supabase = await createClient();

  const { error } = await supabase
    .from("cases")
    .update({ archived_at: new Date().toISOString(), status: "archived" })
    .eq("id", caseId)
    .eq("firm_id", session.firm.id);

  if (error) return { ok: false as const, error: "تعذر أرشفة القضية." };
  revalidatePath("/cases");
  return { ok: true as const };
}
