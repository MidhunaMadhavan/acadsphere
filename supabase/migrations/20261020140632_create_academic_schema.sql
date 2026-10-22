create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'student',
  'teacher',
  'hod',
  'admin'
);

create type public.document_status as enum (
  'processing',
  'indexed',
  'failed'
);

create type public.exam_status as enum (
  'draft',
  'generating',
  'validating',
  'locked',
  'encrypted',
  'released',
  'archived'
);

create type public.generation_status as enum (
  'queued',
  'generating',
  'validating',
  'completed',
  'failed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  unit text,
  created_at timestamptz not null default now(),
  unique(subject_id, name)
);

create table public.syllabus_documents (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  file_name text not null,
  mime_type text not null,
  storage_path text not null,
  file_size bigint not null,
  status public.document_status not null default 'processing',
  chunk_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.syllabus_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding_ref text,
  source_page integer,
  created_at timestamptz not null default now(),
  unique(document_id, chunk_index)
);

create table public.practice_tests (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  topic text not null,
  question_count integer not null check (question_count > 0),
  duration_minutes integer not null check (duration_minutes > 0),
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.practice_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.practice_tests(id) on delete cascade,
  topic text not null,
  question_text text not null,
  options jsonb,
  correct_answer text,
  marks integer not null default 1 check (marks > 0),
  created_at timestamptz not null default now()
);

create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.practice_tests(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  score integer not null default 0,
  total_marks integer not null,
  status text not null default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create table public.internal_exams (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  exam_date timestamptz not null,
  release_start timestamptz not null,
  release_end timestamptz not null,
  total_marks integer not null check (total_marks > 0),
  configuration jsonb not null default '{}'::jsonb,
  status public.exam_status not null default 'draft',
  created_at timestamptz not null default now(),
  check (release_end > release_start)
);

create table public.generation_requests (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.internal_exams(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  status public.generation_status not null default 'queued',
  progress integer not null default 0 check (progress between 0 and 100),
  provider text,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.question_pool (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.internal_exams(id) on delete cascade,
  question_id text not null unique,
  subject text not null,
  topic text not null,
  question_text text not null,
  question_type text not null check (question_type in ('MCQ', 'SHORT_ANSWER')),
  marks integer not null check (marks > 0),
  difficulty text not null check (difficulty in ('EASY', 'MEDIUM', 'HARD')),
  bloom_level text not null,
  source_reference text not null,
  validation_status text not null default 'PENDING',
  quality_score integer not null default 0 check (quality_score between 0 and 100),
  created_at timestamptz not null default now()
);

create table public.encrypted_papers (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null unique references public.internal_exams(id) on delete cascade,
  storage_path text not null,
  algorithm text not null default 'AES-256-GCM',
  key_version text not null,
  nonce text not null,
  auth_tag text not null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  role public.app_role,
  event text not null,
  resource text not null,
  success boolean not null default true,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table public.print_sessions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.internal_exams(id) on delete cascade,
  issued_to uuid not null references public.profiles(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index syllabus_documents_subject_idx
  on public.syllabus_documents(subject_id);

create index document_chunks_document_idx
  on public.document_chunks(document_id);

create index practice_attempts_student_idx
  on public.practice_attempts(student_id);

create index internal_exams_status_idx
  on public.internal_exams(status);

create index audit_logs_created_at_idx
  on public.audit_logs(created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  )
  on conflict (id) do nothing;

  insert into public.user_roles (
    user_id,
    role
  )
  values (
    new.id,
    'student'
  )
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = required_role
  );
$$;

create or replace function public.has_any_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = any(required_roles)
  );
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.syllabus_documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.practice_tests enable row level security;
alter table public.practice_questions enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.internal_exams enable row level security;
alter table public.generation_requests enable row level security;
alter table public.question_pool enable row level security;
alter table public.encrypted_papers enable row level security;
alter table public.audit_logs enable row level security;
alter table public.print_sessions enable row level security;

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select on public.user_roles to authenticated;

grant select on public.subjects to authenticated;
grant insert, update, delete on public.subjects to authenticated;

grant select on public.topics to authenticated;
grant insert, update, delete on public.topics to authenticated;

grant select, insert on public.syllabus_documents to authenticated;
grant select, insert on public.document_chunks to authenticated;

grant select on public.practice_tests to authenticated;
grant insert, update, delete on public.practice_tests to authenticated;

grant select on public.practice_questions to authenticated;
grant insert, update, delete on public.practice_questions to authenticated;

grant select, insert, update on public.practice_attempts to authenticated;

grant select, insert on public.internal_exams to authenticated;
grant update on public.internal_exams to authenticated;

grant select, insert on public.generation_requests to authenticated;
grant update on public.generation_requests to authenticated;

grant select on public.question_pool to authenticated;
grant select on public.encrypted_papers to authenticated;
grant select on public.audit_logs to authenticated;
grant select, insert, update on public.print_sessions to authenticated;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Authenticated users can view subjects"
on public.subjects
for select
to authenticated
using (true);

create policy "Teachers can create subjects"
on public.subjects
for insert
to authenticated
with check (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
  and (select auth.uid()) = created_by
);

create policy "Teachers can update subjects"
on public.subjects
for update
to authenticated
using (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
)
with check (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
);

create policy "Authenticated users can view topics"
on public.topics
for select
to authenticated
using (true);

create policy "Teachers can manage topics"
on public.topics
for all
to authenticated
using (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
)
with check (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
);

create policy "Teachers can view syllabus documents"
on public.syllabus_documents
for select
to authenticated
using (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
);

create policy "Teachers can upload syllabus documents"
on public.syllabus_documents
for insert
to authenticated
with check (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
  and (select auth.uid()) = uploaded_by
);

create policy "Teachers can view document chunks"
on public.document_chunks
for select
to authenticated
using (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
);

create policy "Users can view published practice tests"
on public.practice_tests
for select
to authenticated
using (
  published = true
  or created_by = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "Teachers can create practice tests"
on public.practice_tests
for insert
to authenticated
with check (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
  and (select auth.uid()) = created_by
);

create policy "Teachers can update practice tests"
on public.practice_tests
for update
to authenticated
using (
  created_by = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
)
with check (
  created_by = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "Students can view practice questions for published tests"
on public.practice_questions
for select
to authenticated
using (
  exists (
    select 1
    from public.practice_tests
    where practice_tests.id = practice_questions.test_id
      and (
        practice_tests.published = true
        or practice_tests.created_by = (select auth.uid())
        or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
      )
  )
);

create policy "Students can manage their own attempts"
on public.practice_attempts
for all
to authenticated
using (
  student_id = (select auth.uid())
  or (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
)
with check (
  student_id = (select auth.uid())
  or (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
);

create policy "Teachers can view exam metadata"
on public.internal_exams
for select
to authenticated
using (
  created_by = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "Teachers can create exams"
on public.internal_exams
for insert
to authenticated
with check (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
  and created_by = (select auth.uid())
);

create policy "Teachers can update their exams"
on public.internal_exams
for update
to authenticated
using (
  created_by = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
)
with check (
  created_by = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "Users can view allowed generation requests"
on public.generation_requests
for select
to authenticated
using (
  requested_by = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "Teachers can create generation requests"
on public.generation_requests
for insert
to authenticated
with check (
  (select public.has_any_role(array['teacher', 'hod', 'admin']::public.app_role[]))
  and requested_by = (select auth.uid())
);

create policy "HOD can view question pool"
on public.question_pool
for select
to authenticated
using (
  (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "HOD can view encrypted papers"
on public.encrypted_papers
for select
to authenticated
using (
  (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "HOD can view audit logs"
on public.audit_logs
for select
to authenticated
using (
  (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);

create policy "HOD can manage print sessions"
on public.print_sessions
for all
to authenticated
using (
  issued_to = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
)
with check (
  issued_to = (select auth.uid())
  or (select public.has_any_role(array['hod', 'admin']::public.app_role[]))
);
