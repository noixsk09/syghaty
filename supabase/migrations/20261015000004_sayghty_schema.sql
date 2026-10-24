-- صيغتي | Sayghty — مخطط إضافي للمستندات القانونية والقوالب والاشتراكات
-- لا يعدّل الجداول الموجودة — إضافات آمنة فقط

-- ==============================
-- أنواع مُعرَّفة
-- ==============================

create type public.doc_category as enum (
  'civil_contracts',
  'sale_rent',
  'employment',
  'commercial',
  'legal_notices',
  'lawsuits',
  'legal_memos',
  'procedural',
  'poa_forms'
);

create type public.doc_status as enum (
  'draft',
  'finalized'
);

create type public.drafting_style as enum (
  'concise',
  'detailed',
  'formal'
);

create type public.subscription_plan as enum (
  'free',
  'professional',
  'firm'
);

create type public.subscription_status as enum (
  'active',
  'expired',
  'cancelled'
);

-- ==============================
-- القوالب القانونية
-- ==============================

create table public.legal_templates (
  id            uuid primary key default gen_random_uuid(),
  firm_id       uuid references public.law_firms (id) on delete cascade,
  -- null = نموذج عام مشترك
  category      public.doc_category not null,
  name          text not null,
  description   text,
  fields        jsonb not null default '[]',
  -- بنية الحقول: [{id, label, type, required, placeholder, options?}]
  body_template text not null,
  -- {{field_id}} placeholders
  is_system     boolean not null default false,
  -- true = قالب عام، false = قالب مكتب
  usage_count   integer not null default 0,
  created_by    uuid references auth.users (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  archived_at   timestamptz
);

create index idx_legal_templates_category on public.legal_templates (category);
create index idx_legal_templates_firm on public.legal_templates (firm_id);

-- ==============================
-- المسودات / المستندات المُنشأة
-- ==============================

create table public.document_drafts (
  id              uuid primary key default gen_random_uuid(),
  firm_id         uuid references public.law_firms (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  template_id     uuid references public.legal_templates (id) on delete set null,
  title           text not null,
  category        public.doc_category,
  drafting_style  public.drafting_style not null default 'formal',
  status          public.doc_status not null default 'draft',
  is_favorite     boolean not null default false,
  form_data       jsonb not null default '{}',
  -- البيانات التي أدخلها المحامي في الـ wizard
  content         text not null default '',
  -- النص الكامل القابل للتعديل
  ai_generated    boolean not null default false,
  -- هل تم توليد المحتوى بالذكاء الاصطناعي؟
  word_count      integer generated always as (
    array_length(regexp_split_to_array(trim(content), '\s+'), 1)
  ) stored,
  version         integer not null default 1,
  last_edited_by  uuid references auth.users (id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  archived_at     timestamptz
);

create index idx_document_drafts_user on public.document_drafts (user_id);
create index idx_document_drafts_firm on public.document_drafts (firm_id);
create index idx_document_drafts_status on public.document_drafts (status);
create index idx_document_drafts_favorite on public.document_drafts (user_id, is_favorite) where is_favorite = true;

-- ==============================
-- سجل إصدارات المستندات (بسيط)
-- ==============================

create table public.draft_versions (
  id          uuid primary key default gen_random_uuid(),
  draft_id    uuid not null references public.document_drafts (id) on delete cascade,
  version     integer not null,
  content     text not null,
  saved_by    uuid references auth.users (id),
  saved_at    timestamptz not null default now()
);

create index idx_draft_versions_draft on public.draft_versions (draft_id, version desc);

-- ==============================
-- خطط الاشتراك
-- ==============================

create table public.subscription_plans_config (
  id              uuid primary key default gen_random_uuid(),
  plan            public.subscription_plan not null unique,
  name_ar         text not null,
  description_ar  text,
  price_egp       numeric(10,2) not null default 0,
  monthly_docs    integer not null default 5,
  -- -1 = غير محدود
  ai_drafts       integer not null default 3,
  -- -1 = غير محدود
  export_formats  text[] not null default array['txt'],
  features        jsonb not null default '[]',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- إدراج الخطط الافتراضية
insert into public.subscription_plans_config (plan, name_ar, description_ar, price_egp, monthly_docs, ai_drafts, export_formats, features)
values
  (
    'free', 'مجانية', 'للمحامي المبتدئ والتجربة',
    0, 5, 3,
    array['txt'],
    '["حتى 5 مستندات شهريًا","3 مسودات بالذكاء الاصطناعي","تصدير TXT","وصول لمكتبة القوالب"]'::jsonb
  ),
  (
    'professional', 'احترافية', 'للمحامي المستقل',
    199, 50, 30,
    array['txt','docx','pdf'],
    '["حتى 50 مستندًا شهريًا","30 مسودة بالذكاء الاصطناعي","تصدير DOCX وPDF وTXT","حفظ تلقائي","سجل التعديلات"]'::jsonb
  ),
  (
    'firm', 'مكتب المحاماة', 'للمكاتب ومتعددي المستخدمين',
    599, -1, -1,
    array['txt','docx','pdf'],
    '["مستندات غير محدودة","ذكاء اصطناعي غير محدود","جميع تنسيقات التصدير","إضافة أعضاء المكتب","تقارير الاستخدام"]'::jsonb
  );

-- ==============================
-- اشتراكات المستخدمين
-- ==============================

create table public.user_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  plan         public.subscription_plan not null default 'free',
  status       public.subscription_status not null default 'active',
  started_at   timestamptz not null default now(),
  expires_at   timestamptz,
  -- null = لا ينتهي (مجاني)
  docs_used    integer not null default 0,
  ai_used      integer not null default 0,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index idx_user_subscriptions_active
  on public.user_subscriptions (user_id)
  where status = 'active';

-- ==============================
-- تحديث قواعد الحد من الاستخدام (دالة مساعدة)
-- ==============================

create or replace function public.get_user_monthly_doc_count(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.document_drafts d
  where d.user_id = p_user_id
    and d.created_at >= date_trunc('month', now())
    and d.archived_at is null;
$$;

create or replace function public.get_user_monthly_ai_count(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.document_drafts d
  where d.user_id = p_user_id
    and d.ai_generated = true
    and d.created_at >= date_trunc('month', now())
    and d.archived_at is null;
$$;

-- ==============================
-- Updated_at triggers للجداول الجديدة
-- ==============================

create trigger set_updated_at_legal_templates
  before update on public.legal_templates
  for each row execute function public.set_updated_at();

create trigger set_updated_at_document_drafts
  before update on public.document_drafts
  for each row execute function public.set_updated_at();

create trigger set_updated_at_user_subscriptions
  before update on public.user_subscriptions
  for each row execute function public.set_updated_at();

-- ==============================
-- RLS للجداول الجديدة
-- ==============================

alter table public.legal_templates enable row level security;
alter table public.document_drafts enable row level security;
alter table public.draft_versions enable row level security;
alter table public.subscription_plans_config enable row level security;
alter table public.user_subscriptions enable row level security;

-- القوالب: الجميع يقرأ القوالب العامة؛ أعضاء المكتب يقرؤون قوالب مكتبهم
create policy legal_templates_select on public.legal_templates
  for select using (
    is_system = true
    or firm_id is null
    or (firm_id is not null and public.is_firm_member(firm_id))
  );

create policy legal_templates_write on public.legal_templates
  for all using (
    firm_id is not null and public.has_firm_role(firm_id, array['owner','office_manager']::public.user_role[])
  ) with check (
    firm_id is not null and public.has_firm_role(firm_id, array['owner','office_manager']::public.user_role[])
  );

-- المستندات: المستخدم يرى مستنداته فقط
create policy document_drafts_select on public.document_drafts
  for select using (user_id = auth.uid());

create policy document_drafts_insert on public.document_drafts
  for insert with check (user_id = auth.uid());

create policy document_drafts_update on public.document_drafts
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy document_drafts_delete on public.document_drafts
  for delete using (user_id = auth.uid());

-- سجل الإصدارات: المستخدم يرى إصدارات مستنداته فقط
create policy draft_versions_select on public.draft_versions
  for select using (
    exists (
      select 1 from public.document_drafts d
      where d.id = draft_id and d.user_id = auth.uid()
    )
  );

create policy draft_versions_insert on public.draft_versions
  for insert with check (
    exists (
      select 1 from public.document_drafts d
      where d.id = draft_id and d.user_id = auth.uid()
    )
  );

-- خطط الاشتراك: الجميع يقرأ
create policy subscription_plans_select on public.subscription_plans_config
  for select using (is_active = true);

-- اشتراك المستخدم: يرى اشتراكه فقط
create policy user_subscriptions_select on public.user_subscriptions
  for select using (user_id = auth.uid());

create policy user_subscriptions_insert on public.user_subscriptions
  for insert with check (user_id = auth.uid());

create policy user_subscriptions_update on public.user_subscriptions
  for update using (user_id = auth.uid());
