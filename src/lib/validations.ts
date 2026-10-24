import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    confirmPassword: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export const firmSetupSchema = z.object({
  name: z.string().min(2, "اسم المكتب مطلوب"),
  tradeName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("البريد غير صالح").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
});

export const clientSchema = z.object({
  full_name: z.string().min(2, "اسم العميل مطلوب"),
  national_id: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("البريد غير صالح").optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const caseSchema = z.object({
  title: z.string().min(2, "عنوان القضية مطلوب"),
  client_id: z.string().uuid("يجب اختيار عميل"),
  case_number: z.string().optional(),
  case_year: z.coerce.number().int().min(1900).max(2100).optional().or(z.nan()).transform((v) => (Number.isNaN(v) ? undefined : v)),
  court_name: z.string().optional(),
  circuit: z.string().optional(),
  case_type: z.string().optional(),
  status: z.enum(["draft", "open", "in_progress", "on_hold", "closed", "archived"]),
  opponent_name: z.string().optional(),
  subject: z.string().optional(),
  responsible_lawyer_id: z.string().uuid().optional().or(z.literal("")),
  filed_at: z.string().optional(),
});

export const hearingSchema = z.object({
  case_id: z.string().uuid("يجب اختيار قضية"),
  hearing_at: z.string().min(1, "موعد الجلسة مطلوب"),
  court_name: z.string().optional(),
  circuit: z.string().optional(),
  result: z.string().optional(),
  next_action: z.string().optional(),
  next_hearing_at: z.string().optional(),
  notes: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(2, "عنوان المهمة مطلوب"),
  description: z.string().optional(),
  case_id: z.string().uuid().optional().or(z.literal("")),
  assignee_id: z.string().uuid().optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["todo", "in_progress", "done", "cancelled"]),
  due_at: z.string().optional(),
});

export const feeAgreementSchema = z.object({
  client_id: z.string().uuid("يجب اختيار عميل"),
  case_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(2, "عنوان الاتفاق مطلوب"),
  agreed_amount: z.coerce.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  currency: z.string().default("EGP"),
  notes: z.string().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(["fee_due", "collection", "expense", "adjustment"]),
  amount: z.coerce.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  currency: z.string().default("EGP"),
  occurred_at: z.string().min(1, "التاريخ مطلوب"),
  client_id: z.string().uuid().optional().or(z.literal("")),
  case_id: z.string().uuid().optional().or(z.literal("")),
  fee_agreement_id: z.string().uuid().optional().or(z.literal("")),
  description: z.string().optional(),
});

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;
