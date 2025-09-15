-- Enable extensions
create extension if not exists pgcrypto;

-- Tables
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_by uuid not null references auth.users(id)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','client_admin','learner')),
  unique (org_id, user_id)
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft','sent','approved','declined')),
  share_token text,
  summary_md text,
  created_at timestamptz not null default now(),
  unique (org_id, slug)
);

create table if not exists public.proposal_sections (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  title text not null,
  body_md text not null,
  sort int not null default 0
);

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  title text not null,
  status text not null default 'pending' check (status in ('pending','in_progress','done')),
  due_date date,
  sort int not null default 0
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null,
  title text not null,
  summary_md text,
  is_public boolean not null default false,
  unique (org_id, slug)
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  sort int not null default 0,
  unique (course_id, slug)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  video_url text,
  pdf_url text,
  body_md text,
  sort int not null default 0,
  unique (module_id, slug)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  progress_json jsonb not null default '{}'::jsonb,
  unique (user_id, course_id)
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  prompt text not null,
  options_json jsonb not null,
  answer_index int not null
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  answers_json jsonb not null,
  score int not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_sections enable row level security;
alter table public.deliverables enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

-- Organizations: owner can select/update; members can select
create policy org_select_for_members on public.organizations
  for select using (
    auth.uid() = created_by or exists (
      select 1 from public.memberships m where m.org_id = organizations.id and m.user_id = auth.uid()
    )
  );

create policy org_update_owner_only on public.organizations
  for update using (auth.uid() = created_by);

create policy org_insert_owner on public.organizations
  for insert with check (auth.uid() = created_by);

-- Profiles: user can select/update own
create policy profiles_self_select on public.profiles for select using (id = auth.uid());
create policy profiles_self_upsert on public.profiles for insert with check (id = auth.uid());
create policy profiles_self_update on public.profiles for update using (id = auth.uid());

-- Memberships: user sees own rows; org owner can manage
create policy memberships_self_select on public.memberships for select using (user_id = auth.uid());
create policy memberships_owner_insert on public.memberships for insert with check (
  exists (select 1 from public.organizations o where o.id = memberships.org_id and o.created_by = auth.uid())
);
create policy memberships_owner_update on public.memberships for update using (
  exists (select 1 from public.organizations o where o.id = memberships.org_id and o.created_by = auth.uid())
);
create policy memberships_owner_delete on public.memberships for delete using (
  exists (select 1 from public.organizations o where o.id = memberships.org_id and o.created_by = auth.uid())
);

-- Helper: check if user is member of org
create or replace function public.is_member(p_org_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.memberships m where m.org_id = p_org_id and m.user_id = auth.uid()
  );
$$;

-- Helper: check owner
create or replace function public.is_owner(p_org_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.organizations o where o.id = p_org_id and o.created_by = auth.uid()
  );
$$;

grant execute on function public.is_owner(uuid) to anon, authenticated;

-- Proposals policies: members can read; only owners can insert/update/delete
drop policy if exists proposals_rw_for_members on public.proposals;

create policy proposals_select_for_members on public.proposals
  for select using (public.is_member(org_id) or public.is_owner(org_id));

create policy proposals_insert_owner_only on public.proposals
  for insert with check (public.is_owner(org_id));

create policy proposals_update_owner_only on public.proposals
  for update using (public.is_owner(org_id)) with check (public.is_owner(org_id));

create policy proposals_delete_owner_only on public.proposals
  for delete using (public.is_owner(org_id));

-- Proposal sections / deliverables via proposal -> org
drop policy if exists proposal_sections_rw_for_members on public.proposal_sections;

create policy proposal_sections_select_members on public.proposal_sections
  for select using (
    exists (
      select 1 from public.proposals p where p.id = proposal_sections.proposal_id and (public.is_member(p.org_id) or public.is_owner(p.org_id))
    )
  );

create policy proposal_sections_write_owner on public.proposal_sections
  for all using (
    exists (
      select 1 from public.proposals p where p.id = proposal_sections.proposal_id and public.is_owner(p.org_id)
    )
  ) with check (
    exists (
      select 1 from public.proposals p where p.id = proposal_sections.proposal_id and public.is_owner(p.org_id)
    )
  );

drop policy if exists deliverables_rw_for_members on public.deliverables;

create policy deliverables_select_members on public.deliverables
  for select using (
    exists (
      select 1 from public.proposals p where p.id = deliverables.proposal_id and (public.is_member(p.org_id) or public.is_owner(p.org_id))
    )
  );

create policy deliverables_write_owner on public.deliverables
  for all using (
    exists (
      select 1 from public.proposals p where p.id = deliverables.proposal_id and public.is_owner(p.org_id)
    )
  ) with check (
    exists (
      select 1 from public.proposals p where p.id = deliverables.proposal_id and public.is_owner(p.org_id)
    )
  );

-- Courses and nested: org members
create policy courses_rw_for_members on public.courses
  for all using (public.is_member(org_id) or auth.uid() = (select created_by from public.organizations o where o.id = courses.org_id))
  with check (public.is_member(org_id) or auth.uid() = (select created_by from public.organizations o where o.id = courses.org_id));

create policy modules_rw_for_members on public.modules
  for all using (
    exists (
      select 1 from public.courses c where c.id = modules.course_id and (public.is_member(c.org_id) or auth.uid() = (select created_by from public.organizations o where o.id = c.org_id))
    )
  ) with check (
    exists (
      select 1 from public.courses c where c.id = modules.course_id and (public.is_member(c.org_id) or auth.uid() = (select created_by from public.organizations o where o.id = c.org_id))
    )
  );

create policy lessons_rw_for_members on public.lessons
  for all using (
    exists (
      select 1 from public.modules m join public.courses c on c.id = m.course_id
      where m.id = lessons.module_id and (public.is_member(c.org_id) or auth.uid() = (select created_by from public.organizations o where o.id = c.org_id))
    )
  ) with check (
    exists (
      select 1 from public.modules m join public.courses c on c.id = m.course_id
      where m.id = lessons.module_id and (public.is_member(c.org_id) or auth.uid() = (select created_by from public.organizations o where o.id = c.org_id))
    )
  );

-- Enrollments: self access
create policy enrollments_self_select on public.enrollments for select using (user_id = auth.uid());
create policy enrollments_self_upsert on public.enrollments for insert with check (user_id = auth.uid());
create policy enrollments_self_update on public.enrollments for update using (user_id = auth.uid());

-- Quiz Q/A: members to read; attempts are self
create policy quiz_questions_read_members on public.quiz_questions
  for select using (
    exists (
      select 1 from public.lessons l join public.modules m on m.id = l.module_id join public.courses c on c.id = m.course_id
      where l.id = quiz_questions.lesson_id and (public.is_member(c.org_id) or auth.uid() = (select created_by from public.organizations o where o.id = c.org_id))
    )
  );

create policy quiz_attempts_self_rw on public.quiz_attempts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Public proposal read via RPC with share token
create or replace function public.get_proposal_public(org_slug text, proposal_slug text, share text)
returns setof public.proposals
language plpgsql security definer as $$
begin
  return query select p.* from public.proposals p
    join public.organizations o on o.id = p.org_id
    where o.slug = org_slug and p.slug = proposal_slug and p.share_token is not null and p.share_token = share;
end;
$$;

grant execute on function public.get_proposal_public(text, text, text) to anon, authenticated;

-- Note: call public.get_proposal_public(org_slug, proposal_slug, share) from the app to allow public reads.

-- Public sections/deliverables for shared proposal
create or replace function public.get_proposal_sections_public(org_slug text, proposal_slug text, share text)
returns setof public.proposal_sections
language plpgsql security definer as $$
begin
  return query select s.* from public.proposal_sections s
    join public.proposals p on p.id = s.proposal_id
    join public.organizations o on o.id = p.org_id
    where o.slug = org_slug and p.slug = proposal_slug and p.share_token is not null and p.share_token = share
    order by s.sort asc;
end;
$$;

create or replace function public.get_deliverables_public(org_slug text, proposal_slug text, share text)
returns setof public.deliverables
language plpgsql security definer as $$
begin
  return query select d.* from public.deliverables d
    join public.proposals p on p.id = d.proposal_id
    join public.organizations o on o.id = p.org_id
    where o.slug = org_slug and p.slug = proposal_slug and p.share_token is not null and p.share_token = share
    order by d.sort asc;
end;
$$;

grant execute on function public.get_proposal_sections_public(text, text, text) to anon, authenticated;
grant execute on function public.get_deliverables_public(text, text, text) to anon, authenticated;
