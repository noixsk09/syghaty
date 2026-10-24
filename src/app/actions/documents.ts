"use server";

/**
 * Server Actions لإدارة مستندات صيغتي.
 * كل عملية تتحقق من ملكية المستخدم على الخادم.
 */

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { DocCategory, DraftingStyle, DocStatus } from "@/types/database";
import { z } from "zod";

// ==============================
// مخطط التحقق
// ==============================

const createDraftSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(200, "العنوان طويل جدًا"),
  category: z.string(),
  template_id: z.string().nullable().optional(),
  drafting_style: z.enum(["concise", "detailed", "formal"]).default("formal"),
  form_data: z.record(z.string(), z.string()).default({}),
  content: z.string().default(""),
  ai_generated: z.boolean().default(false),
});

// ==============================
// إنشاء مسودة جديدة
// ==============================

export async function createDraftAction(data: {
  title: string;
  category: DocCategory;
  templateId?: string | null;
  draftingStyle: DraftingStyle;
  formData: Record<string, string>;
  content: string;
  aiGenerated: boolean;
}): Promise<{ id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("يجب تسجيل الدخول أولاً.");

  // التحقق من حدود الاشتراك
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("plan, docs_used, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const plan = sub?.plan ?? "free";
  const docsUsed = sub?.docs_used ?? 0;

  // حد الخطة المجانية: 5 مستندات/شهر
  if (plan === "free" && docsUsed >= 5) {
    throw new Error(
      "وصلت لحد الخطة المجانية (5 مستندات). يرجى الترقية للاستمرار.",
    );
  }

  const validated = createDraftSchema.parse({
    title: data.title,
    category: data.category,
    template_id: data.templateId ?? null,
    drafting_style: data.draftingStyle,
    form_data: data.formData,
    content: data.content,
    ai_generated: data.aiGenerated,
  });

  const { data: draft, error } = await supabase
    .from("document_drafts")
    .insert({
      user_id: user.id,
      template_id: validated.template_id,
      title: validated.title,
      category: validated.category as DocCategory,
      drafting_style: validated.drafting_style as DraftingStyle,
      status: "draft" as DocStatus,
      form_data: validated.form_data,
      content: validated.content,
      ai_generated: validated.ai_generated,
      version: 1,
      last_edited_by: user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(`فشل إنشاء المستند: ${error.message}`);

  // تحديث عداد الاشتراك
  if (sub) {
    await supabase
      .from("user_subscriptions")
      .update({ docs_used: docsUsed + 1 })
      .eq("user_id", user.id)
      .eq("status", "active");
  } else {
    // إنشاء اشتراك مجاني تلقائي
    await supabase.from("user_subscriptions").insert({
      user_id: user.id,
      plan: "free",
      status: "active",
      docs_used: 1,
      ai_used: 0,
    });
  }

  // تسجيل أول إصدار
  await supabase.from("draft_versions").insert({
    draft_id: draft.id,
    version: 1,
    content: validated.content,
    saved_by: user.id,
  });

  revalidatePath("/documents");
  return { id: draft.id };
}

// ==============================
// تحديث محتوى المسودة
// ==============================

export async function updateDraftContentAction(
  draftId: string,
  content: string,
  saveVersion = false,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("يجب تسجيل الدخول أولاً.");

  // تحقق من الملكية على الخادم
  const { data: existing } = await supabase
    .from("document_drafts")
    .select("id, version, user_id")
    .eq("id", draftId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) throw new Error("المستند غير موجود أو لا تملك صلاحية تعديله.");

  const newVersion = existing.version + (saveVersion ? 1 : 0);

  await supabase
    .from("document_drafts")
    .update({
      content,
      version: newVersion,
      last_edited_by: user.id,
    })
    .eq("id", draftId)
    .eq("user_id", user.id);

  if (saveVersion) {
    await supabase.from("draft_versions").insert({
      draft_id: draftId,
      version: newVersion,
      content,
      saved_by: user.id,
    });
  }

  revalidatePath(`/documents/${draftId}/edit`);
  revalidatePath("/documents");
}

// ==============================
// تحديث عنوان المسودة
// ==============================

export async function updateDraftTitleAction(
  draftId: string,
  title: string,
): Promise<void> {
  if (!title.trim()) throw new Error("العنوان لا يمكن أن يكون فارغًا.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("يجب تسجيل الدخول أولاً.");

  const { error } = await supabase
    .from("document_drafts")
    .update({ title: title.trim() })
    .eq("id", draftId)
    .eq("user_id", user.id);

  if (error) throw new Error(`فشل تحديث العنوان: ${error.message}`);

  revalidatePath(`/documents/${draftId}/edit`);
  revalidatePath("/documents");
}

// ==============================
// تبديل المفضلة
// ==============================

export async function toggleFavoriteAction(
  draftId: string,
  isFavorite: boolean,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("يجب تسجيل الدخول أولاً.");

  await supabase
    .from("document_drafts")
    .update({ is_favorite: isFavorite })
    .eq("id", draftId)
    .eq("user_id", user.id);

  revalidatePath("/documents");
  revalidatePath("/documents/favorites");
}

// ==============================
// حذف مسودة (أرشفة)
// ==============================

export async function archiveDraftAction(draftId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("يجب تسجيل الدخول أولاً.");

  const { error } = await supabase
    .from("document_drafts")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", draftId)
    .eq("user_id", user.id);

  if (error) throw new Error(`فشل الحذف: ${error.message}`);

  revalidatePath("/documents");
  redirect("/documents");
}

// ==============================
// نسخ مسودة
// ==============================

export async function duplicateDraftAction(draftId: string): Promise<{ id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("يجب تسجيل الدخول أولاً.");

  const { data: original } = await supabase
    .from("document_drafts")
    .select("*")
    .eq("id", draftId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!original) throw new Error("المستند غير موجود.");

  const { data: copy, error } = await supabase
    .from("document_drafts")
    .insert({
      user_id: user.id,
      template_id: original.template_id,
      title: `نسخة من ${original.title}`,
      category: original.category,
      drafting_style: original.drafting_style,
      status: "draft",
      form_data: original.form_data,
      content: original.content,
      ai_generated: false,
      version: 1,
      last_edited_by: user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(`فشل النسخ: ${error.message}`);

  revalidatePath("/documents");
  return { id: copy.id };
}
