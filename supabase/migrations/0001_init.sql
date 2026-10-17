-- EarlyHire ATS — initial schema
-- Tables are prefixed ats_ to avoid collisions in a shared database.
-- RLS is enabled with no public policies: all access goes through the
-- Next.js server using the service-role key (bypasses RLS).

create table if not exists public.ats_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  department text check (department is null or char_length(department) <= 120),
  location text check (location is null or char_length(location) <= 120),
  employment_type text not null default 'Full-time'
    check (employment_type in ('Full-time', 'Part-time', 'Contract', 'Internship')),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.ats_candidates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.ats_jobs (id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null
    check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone text check (phone is null or char_length(phone) <= 30),
  location text check (location is null or char_length(location) <= 120),
  current_title text check (current_title is null or char_length(current_title) <= 160),
  current_company text check (current_company is null or char_length(current_company) <= 160),
  experience_years int check (experience_years is null or (experience_years between 0 and 60)),
  skills text[] not null default '{}',
  resume_summary text check (resume_summary is null or char_length(resume_summary) <= 4000),
  source text not null default 'Direct'
    check (char_length(source) between 1 and 80),
  stage text not null default 'applied'
    check (stage in ('applied', 'screening', 'shortlisted', 'interview', 'offer', 'joined', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ats_events (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.ats_candidates (id) on delete cascade,
  kind text not null check (kind in ('stage_change', 'note')),
  from_stage text
    check (from_stage is null or from_stage in ('applied', 'screening', 'shortlisted', 'interview', 'offer', 'joined', 'rejected')),
  to_stage text
    check (to_stage is null or to_stage in ('applied', 'screening', 'shortlisted', 'interview', 'offer', 'joined', 'rejected')),
  body text check (body is null or char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  constraint ats_events_shape check (
    (kind = 'stage_change' and to_stage is not null and body is null)
    or (kind = 'note' and body is not null and from_stage is null and to_stage is null)
  )
);

create index if not exists ats_candidates_job_id_idx on public.ats_candidates (job_id);
create index if not exists ats_candidates_stage_idx on public.ats_candidates (stage);
create index if not exists ats_candidates_created_at_idx on public.ats_candidates (created_at desc);
create index if not exists ats_events_candidate_created_idx
  on public.ats_events (candidate_id, created_at desc);
create index if not exists ats_events_kind_to_stage_idx
  on public.ats_events (kind, to_stage);

-- Keep updated_at fresh on candidate updates.
create or replace function public.ats_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists ats_candidates_set_updated_at on public.ats_candidates;
create trigger ats_candidates_set_updated_at
  before update on public.ats_candidates
  for each row execute function public.ats_set_updated_at();

-- Atomic stage change: updates the candidate and records stage history in one
-- transaction so history can never drift from the current stage.
create or replace function public.ats_change_candidate_stage(
  p_candidate_id uuid,
  p_new_stage text,
  p_note text default null
)
returns public.ats_candidates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current public.ats_candidates.stage%type;
  v_row public.ats_candidates;
begin
  if p_new_stage not in ('applied', 'screening', 'shortlisted', 'interview', 'offer', 'joined', 'rejected') then
    raise exception 'invalid stage: %', p_new_stage;
  end if;

  select stage into v_current
  from public.ats_candidates
  where id = p_candidate_id
  for update;

  if not found then
    raise exception 'candidate % not found', p_candidate_id;
  end if;

  if v_current = p_new_stage then
    select * into v_row from public.ats_candidates where id = p_candidate_id;
    return v_row;
  end if;

  update public.ats_candidates
  set stage = p_new_stage
  where id = p_candidate_id
  returning * into v_row;

  insert into public.ats_events (candidate_id, kind, from_stage, to_stage)
  values (p_candidate_id, 'stage_change', v_current, p_new_stage);

  if p_note is not null and char_length(trim(p_note)) > 0 then
    insert into public.ats_events (candidate_id, kind, body)
    values (p_candidate_id, 'note', trim(p_note));
  end if;

  return v_row;
end;
$$;

revoke all on function public.ats_change_candidate_stage(uuid, text, text) from public, anon, authenticated;

-- RLS enabled, no policies: only the service role (bypasses RLS) can read/write.
alter table public.ats_jobs enable row level security;
alter table public.ats_candidates enable row level security;
alter table public.ats_events enable row level security;
