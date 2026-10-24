-- Mo7ami Pro initial schema
-- Safe create-only migration. Do not run destructive changes without approval.

create extension if not exists "pgcrypto";

create type public.user_role as enum (
  'owner',
  'office_manager',
  'lawyer',
  'secretary',
  'accountant'
);

create type public.case_status as enum (
  'draft',
  'open',
  'in_progress',
  'on_hold',
  'closed',
  'archived'
);

create type public.task_status as enum (
  'todo',
  'in_progress',
  'done',
  'cancelled'
);

create type public.task_priority as enum (
  'low',
  'medium',
  'high',
  'urgent'
);

create type public.transaction_type as enum (
  'fee_due',
  'collection',
  'expense',
  'adjustment'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.law_firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trade_name text,
  tax_id text,
  phone text,
  email text,
  address text,
  city text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.firm_members (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.user_role not null,
  is_active boolean not null default true,
  invited_email text,
  joined_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (firm_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  full_name text not null,
  national_id text,
  phone text,
  email text,
  address text,
  notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  client_id uuid not null references public.clients (id),
  title text not null,
  case_number text,
  case_year integer,
  court_name text,
  circuit text,
  case_type text,
  status public.case_status not null default 'open',
  opponent_name text,
  subject text,
  responsible_lawyer_id uuid references auth.users (id),
  filed_at date,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  case_id uuid not null references public.cases (id) on delete cascade,
  event_at timestamptz not null default now(),
  title text not null,
  details text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.hearings (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  case_id uuid not null references public.cases (id) on delete cascade,
  hearing_at timestamptz not null,
  court_name text,
  circuit text,
  result text,
  next_action text,
  next_hearing_at timestamptz,
  notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  case_id uuid references public.cases (id) on delete set null,
  title text not null,
  description text,
  assignee_id uuid references auth.users (id),
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'todo',
  due_at timestamptz,
  completed_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  case_id uuid references public.cases (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  title text not null,
  file_path text not null,
  mime_type text,
  file_size bigint,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.fee_agreements (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  case_id uuid references public.cases (id) on delete set null,
  client_id uuid not null references public.clients (id),
  title text not null,
  agreed_amount numeric(14, 2) not null check (agreed_amount >= 0),
  currency text not null default 'EGP',
  notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  case_id uuid references public.cases (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  fee_agreement_id uuid references public.fee_agreements (id) on delete set null,
  type public.transaction_type not null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'EGP',
  occurred_at timestamptz not null default now(),
  description text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.law_firms (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references public.law_firms (id) on delete set null,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Prevent cross-firm client linkage on cases
create or replace function public.enforce_case_client_same_firm()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.clients c
    where c.id = new.client_id and c.firm_id = new.firm_id and c.archived_at is null
  ) then
    raise exception 'client does not belong to firm';
  end if;
  return new;
end;
$$;

create trigger trg_cases_same_firm
before insert or update on public.cases
for each row execute function public.enforce_case_client_same_firm();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();
create trigger trg_law_firms_updated before update on public.law_firms
for each row execute function public.set_updated_at();
create trigger trg_firm_members_updated before update on public.firm_members
for each row execute function public.set_updated_at();
create trigger trg_clients_updated before update on public.clients
for each row execute function public.set_updated_at();
create trigger trg_cases_updated before update on public.cases
for each row execute function public.set_updated_at();
create trigger trg_hearings_updated before update on public.hearings
for each row execute function public.set_updated_at();
create trigger trg_tasks_updated before update on public.tasks
for each row execute function public.set_updated_at();
create trigger trg_documents_updated before update on public.documents
for each row execute function public.set_updated_at();
create trigger trg_fee_agreements_updated before update on public.fee_agreements
for each row execute function public.set_updated_at();
create trigger trg_financial_transactions_updated before update on public.financial_transactions
for each row execute function public.set_updated_at();

create index idx_firm_members_user on public.firm_members (user_id) where is_active;
create index idx_firm_members_firm on public.firm_members (firm_id) where is_active;
create index idx_clients_firm on public.clients (firm_id) where archived_at is null;
create index idx_clients_name on public.clients (firm_id, full_name);
create index idx_cases_firm on public.cases (firm_id) where archived_at is null;
create index idx_cases_status on public.cases (firm_id, status);
create index idx_cases_client on public.cases (client_id);
create index idx_hearings_firm_at on public.hearings (firm_id, hearing_at);
create index idx_tasks_firm_due on public.tasks (firm_id, due_at);
create index idx_tasks_assignee on public.tasks (assignee_id, status);
create index idx_documents_firm on public.documents (firm_id) where archived_at is null;
create index idx_transactions_firm_at on public.financial_transactions (firm_id, occurred_at);
create index idx_notifications_user on public.notifications (user_id, is_read);
create index idx_audit_firm on public.audit_logs (firm_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
