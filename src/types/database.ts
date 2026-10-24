export type UserRole =
  | "owner"
  | "office_manager"
  | "lawyer"
  | "secretary"
  | "accountant";

export type CaseStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "on_hold"
  | "closed"
  | "archived";

export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TransactionType = "fee_due" | "collection" | "expense" | "adjustment";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LawFirm {
  id: string;
  name: string;
  trade_name: string | null;
  tax_id: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface FirmMember {
  id: string;
  firm_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  invited_email: string | null;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  firm_id: string;
  full_name: string;
  national_id: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface CaseRecord {
  id: string;
  firm_id: string;
  client_id: string;
  title: string;
  case_number: string | null;
  case_year: number | null;
  court_name: string | null;
  circuit: string | null;
  case_type: string | null;
  status: CaseStatus;
  opponent_name: string | null;
  subject: string | null;
  responsible_lawyer_id: string | null;
  filed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface Hearing {
  id: string;
  firm_id: string;
  case_id: string;
  hearing_at: string;
  court_name: string | null;
  circuit: string | null;
  result: string | null;
  next_action: string | null;
  next_hearing_at: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface TaskItem {
  id: string;
  firm_id: string;
  case_id: string | null;
  title: string;
  description: string | null;
  assignee_id: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface DocumentRecord {
  id: string;
  firm_id: string;
  case_id: string | null;
  client_id: string | null;
  title: string;
  file_path: string;
  mime_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface FeeAgreement {
  id: string;
  firm_id: string;
  case_id: string | null;
  client_id: string;
  title: string;
  agreed_amount: number;
  currency: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface FinancialTransaction {
  id: string;
  firm_id: string;
  case_id: string | null;
  client_id: string | null;
  fee_agreement_id: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  occurred_at: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface NotificationItem {
  id: string;
  firm_id: string;
  user_id: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  firm_id: string | null;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "المالك",
  office_manager: "مدير المكتب",
  lawyer: "محامٍ",
  secretary: "سكرتير",
  accountant: "محاسب",
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  draft: "مسودة",
  open: "مفتوحة",
  in_progress: "قيد العمل",
  on_hold: "معلّقة",
  closed: "مغلقة",
  archived: "مؤرشفة",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "للتنفيذ",
  in_progress: "قيد التنفيذ",
  done: "منجزة",
  cancelled: "ملغاة",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "منخفضة",
  medium: "متوسطة",
  high: "عالية",
  urgent: "عاجلة",
};

// ==============================
// صيغتي — أنواع إضافية
// ==============================

export type DocCategory =
  | "civil_contracts"
  | "sale_rent"
  | "employment"
  | "commercial"
  | "legal_notices"
  | "lawsuits"
  | "legal_memos"
  | "procedural"
  | "poa_forms";

export type DocStatus = "draft" | "finalized";
export type DraftingStyle = "concise" | "detailed" | "formal";
export type SubscriptionPlan = "free" | "professional" | "firm";
export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "number" | "select" | "currency";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface LegalTemplate {
  id: string;
  firm_id: string | null;
  category: DocCategory;
  name: string;
  description: string | null;
  fields: TemplateField[];
  body_template: string;
  is_system: boolean;
  usage_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface DocumentDraft {
  id: string;
  firm_id: string | null;
  user_id: string;
  template_id: string | null;
  title: string;
  category: DocCategory | null;
  drafting_style: DraftingStyle;
  status: DocStatus;
  is_favorite: boolean;
  form_data: Record<string, string>;
  content: string;
  ai_generated: boolean;
  word_count: number | null;
  version: number;
  last_edited_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface DraftVersion {
  id: string;
  draft_id: string;
  version: number;
  content: string;
  saved_by: string | null;
  saved_at: string;
}

export interface SubscriptionPlanConfig {
  id: string;
  plan: SubscriptionPlan;
  name_ar: string;
  description_ar: string | null;
  price_egp: number;
  monthly_docs: number;
  ai_drafts: number;
  export_formats: string[];
  features: string[];
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  started_at: string;
  expires_at: string | null;
  docs_used: number;
  ai_used: number;
}

export const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  civil_contracts: "العقود المدنية",
  sale_rent: "عقود البيع والإيجار",
  employment: "عقود العمل",
  commercial: "الاتفاقيات التجارية",
  legal_notices: "الإنذارات القانونية",
  lawsuits: "صحف الدعاوى",
  legal_memos: "المذكرات القانونية",
  procedural: "الطلبات الإجرائية",
  poa_forms: "التوكيلات والإقرارات",
};

export const DRAFTING_STYLE_LABELS: Record<DraftingStyle, string> = {
  concise: "مختصر",
  detailed: "تفصيلي",
  formal: "رسمي",
};

export const SUBSCRIPTION_PLAN_LABELS: Record<SubscriptionPlan, string> = {
  free: "مجانية",
  professional: "احترافية",
  firm: "مكتب المحاماة",
};

export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  draft: "مسودة",
  finalized: "مكتمل",
};
