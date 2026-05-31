-- Idempotent patch: app feedback submit RPC (bypasses RLS on insert; fixes anon RETURNING / insert failures).
-- Run in Supabase SQL editor or: supabase db execute -f supabase/patch-app-feedback.sql

create or replace function public.submit_app_feedback(
  p_contact_email text default null,
  p_contact_name text default null,
  p_user_role text default null,
  p_page_path text default null,
  p_category text default 'general',
  p_message text default null,
  p_rating smallint default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_uid uuid := auth.uid();
  v_email text := nullif(lower(trim(coalesce(p_contact_email, ''))), '');
  v_message text := trim(coalesce(p_message, ''));
  v_category text := coalesce(nullif(trim(coalesce(p_category, '')), ''), 'general');
begin
  if char_length(v_message) < 3 then
    raise exception 'Please write a little more so we can help.';
  end if;
  if char_length(v_message) > 4000 then
    raise exception 'Message is too long.';
  end if;
  if v_category not in ('bug', 'feature', 'password', 'general', 'praise', 'other') then
    raise exception 'Invalid category.';
  end if;
  if p_rating is not null and (p_rating < 1 or p_rating > 5) then
    raise exception 'Invalid rating.';
  end if;
  if v_uid is null and v_email is null then
    raise exception 'Email is required when not signed in.';
  end if;
  if v_uid is null and position('@' in coalesce(v_email, '')) < 2 then
    raise exception 'Valid email is required.';
  end if;

  insert into public.app_feedback (
    user_id,
    contact_email,
    contact_name,
    user_role,
    page_path,
    category,
    message,
    rating,
    status
  )
  values (
    v_uid,
    v_email,
    nullif(trim(coalesce(p_contact_name, '')), ''),
    nullif(trim(coalesce(p_user_role, '')), ''),
    nullif(trim(coalesce(p_page_path, '')), ''),
    v_category,
    v_message,
    p_rating,
    'new'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_app_feedback(text, text, text, text, text, text, smallint) from public;
grant execute on function public.submit_app_feedback(text, text, text, text, text, text, smallint) to anon, authenticated;

-- Ensure table + RLS policies exist (safe if already applied from schema.sql)
create table if not exists public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  contact_email text,
  contact_name text,
  user_role text,
  page_path text,
  category text not null default 'general'
    check (category in ('bug','feature','password','general','praise','other')),
  message text not null check (char_length(message) between 3 and 4000),
  rating smallint check (rating is null or (rating between 1 and 5)),
  status text not null default 'new'
    check (status in ('new','reviewing','resolved','wontfix')),
  admin_notes text,
  suggested_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_feedback enable row level security;

drop policy if exists "feedback insert auth" on public.app_feedback;
create policy "feedback insert auth" on public.app_feedback
  for insert to authenticated
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "feedback insert anon" on public.app_feedback;
create policy "feedback insert anon" on public.app_feedback
  for insert to anon
  with check (user_id is null and contact_email is not null);

drop policy if exists "feedback select self" on public.app_feedback;
create policy "feedback select self" on public.app_feedback
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "feedback admin all" on public.app_feedback;
create policy "feedback admin all" on public.app_feedback
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.app_feedback to authenticated;
grant insert on public.app_feedback to anon;
