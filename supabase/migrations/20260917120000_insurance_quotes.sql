-- Insurance quote submissions get their own table so the structured fields
-- (insurance type, date of birth, smoker status, coverage amount) are queryable
-- instead of being flattened into the contact submission message text.
--
-- Mirrors the insert_contact_submission pattern: the table lives in the private
-- schema (never exposed through PostgREST) and the only thing anon can reach is
-- the SECURITY DEFINER function that writes to it.

create schema if not exists private;

create table if not exists private.insurance_quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null check (char_length(first_name) between 1 and 200),
  last_name text not null check (char_length(last_name) between 1 and 200),
  email text not null check (char_length(email) between 1 and 200),
  phone text not null check (char_length(phone) between 1 and 200),
  insurance_type text not null check (insurance_type in (
    'life', 'life_ci', 'ci', 'disability', 'life_no_medical', 'combination'
  )),
  date_of_birth date,
  sex text check (char_length(sex) <= 50),
  health text check (char_length(health) <= 100),
  smoker boolean,
  coverage_amount text check (char_length(coverage_amount) <= 200),
  comments text check (char_length(comments) <= 5000),
  casl_consent boolean not null default false,
  attribution jsonb
);

comment on table private.insurance_quotes is
  'Insurance quote requests from /financial-services/insurance-quote/. Written only by public.insert_insurance_quote().';

-- Newest-first is how these get read in the dashboard.
create index if not exists insurance_quotes_created_at_idx
  on private.insurance_quotes (created_at desc);

-- No policies: RLS on with nothing granted denies every direct client read.
-- The SECURITY DEFINER function below runs as the owner and bypasses it.
alter table private.insurance_quotes enable row level security;

create or replace function public.insert_insurance_quote(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_insurance_type text,
  p_dob date default null,
  p_sex text default null,
  p_health text default null,
  p_smoker boolean default null,
  p_coverage_amount text default null,
  p_comments text default null,
  p_casl_consent boolean default false,
  p_attribution jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  insert into private.insurance_quotes (
    first_name, last_name, email, phone, insurance_type,
    date_of_birth, sex, health, smoker, coverage_amount,
    comments, casl_consent, attribution
  )
  values (
    p_first_name, p_last_name, p_email, p_phone, p_insurance_type,
    p_dob, p_sex, p_health, p_smoker, p_coverage_amount,
    p_comments, p_casl_consent, p_attribution
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.insert_insurance_quote(
  text, text, text, text, text, date, text, text, boolean, text, text, boolean, jsonb
) from public;

grant execute on function public.insert_insurance_quote(
  text, text, text, text, text, date, text, text, boolean, text, text, boolean, jsonb
) to anon, authenticated;
