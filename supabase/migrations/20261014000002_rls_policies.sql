-- Row Level Security policies for Mo7ami Pro
-- Membership-scoped access. Client-supplied firm_id is never trusted alone.

create or replace function public.is_firm_member(p_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.firm_members m
    where m.firm_id = p_firm_id
      and m.user_id = auth.uid()
      and m.is_active = true
  );
$$;

create or replace function public.firm_role(p_firm_id uuid)
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.firm_members m
  where m.firm_id = p_firm_id
    and m.user_id = auth.uid()
    and m.is_active = true
  limit 1;
$$;

create or replace function public.has_firm_role(p_firm_id uuid, allowed public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.firm_role(p_firm_id) = any (allowed);
$$;

create or replace function public.can_read_finance(p_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_firm_role(
    p_firm_id,
    array['owner', 'office_manager', 'accountant']::public.user_role[]
  );
$$;

create or replace function public.can_write_finance(p_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_firm_role(
    p_firm_id,
    array['owner', 'office_manager', 'accountant']::public.user_role[]
  );
$$;

create or replace function public.can_manage_members(p_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_firm_role(
    p_firm_id,
    array['owner', 'office_manager']::public.user_role[]
  );
$$;

alter table public.profiles enable row level security;
alter table public.law_firms enable row level security;
alter table public.firm_members enable row level security;
alter table public.clients enable row level security;
alter table public.cases enable row level security;
alter table public.case_events enable row level security;
alter table public.hearings enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;
alter table public.fee_agreements enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- profiles
create policy profiles_select_own on public.profiles
for select using (id = auth.uid());
create policy profiles_update_own on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

-- law_firms
create policy law_firms_select on public.law_firms
for select using (public.is_firm_member(id));
create policy law_firms_insert on public.law_firms
for insert with check (created_by = auth.uid());
create policy law_firms_update on public.law_firms
for update using (
  public.has_firm_role(id, array['owner']::public.user_role[])
) with check (
  public.has_firm_role(id, array['owner']::public.user_role[])
);

-- firm_members
create policy firm_members_select on public.firm_members
for select using (public.is_firm_member(firm_id) or user_id = auth.uid());
create policy firm_members_insert_owner_bootstrap on public.firm_members
for insert with check (
  user_id = auth.uid()
  and role = 'owner'
  and exists (
    select 1 from public.law_firms f
    where f.id = firm_id and f.created_by = auth.uid()
  )
);
create policy firm_members_manage on public.firm_members
for all using (public.can_manage_members(firm_id))
with check (public.can_manage_members(firm_id));

-- clients
create policy clients_select on public.clients
for select using (public.is_firm_member(firm_id));
create policy clients_insert on public.clients
for insert with check (
  public.is_firm_member(firm_id)
  and public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);
create policy clients_update on public.clients
for update using (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
) with check (public.is_firm_member(firm_id));

-- cases
create policy cases_select on public.cases
for select using (public.is_firm_member(firm_id));
create policy cases_insert on public.cases
for insert with check (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);
create policy cases_update on public.cases
for update using (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
) with check (public.is_firm_member(firm_id));

-- case_events
create policy case_events_select on public.case_events
for select using (public.is_firm_member(firm_id));
create policy case_events_insert on public.case_events
for insert with check (public.is_firm_member(firm_id));

-- hearings
create policy hearings_select on public.hearings
for select using (public.is_firm_member(firm_id));
create policy hearings_write on public.hearings
for all using (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
) with check (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);

-- tasks
create policy tasks_select on public.tasks
for select using (public.is_firm_member(firm_id));
create policy tasks_write on public.tasks
for all using (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
) with check (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);

-- documents metadata
create policy documents_select on public.documents
for select using (public.is_firm_member(firm_id));
create policy documents_write on public.documents
for all using (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
) with check (
  public.has_firm_role(
    firm_id,
    array['owner', 'office_manager', 'lawyer', 'secretary']::public.user_role[]
  )
);

-- finance
create policy fee_agreements_select on public.fee_agreements
for select using (public.can_read_finance(firm_id));
create policy fee_agreements_write on public.fee_agreements
for all using (public.can_write_finance(firm_id))
with check (public.can_write_finance(firm_id));

create policy financial_transactions_select on public.financial_transactions
for select using (public.can_read_finance(firm_id));
create policy financial_transactions_write on public.financial_transactions
for all using (public.can_write_finance(firm_id))
with check (public.can_write_finance(firm_id));

-- notifications
create policy notifications_select on public.notifications
for select using (user_id = auth.uid() and public.is_firm_member(firm_id));
create policy notifications_update on public.notifications
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- audit logs: read-only for managers
create policy audit_logs_select on public.audit_logs
for select using (
  firm_id is not null
  and public.has_firm_role(
    firm_id,
    array['owner', 'office_manager']::public.user_role[]
  )
);
-- inserts via security definer helpers only (no direct insert policy for clients)
