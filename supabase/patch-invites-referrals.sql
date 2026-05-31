-- Run in Supabase → SQL Editor if Admin shows:
--   "Could not find the table 'public.referral_requests' in the schema cache"
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE).

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.referral_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (position('@' in email) > 1),
  reason text not null check (char_length(trim(reason)) between 8 and 2000),
  referrer_name text,
  referrer_email text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_invite_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (char_length(trim(code)) between 8 and 64),
  status text not null default 'active'
    check (status in ('active','used','revoked','expired')),
  issued_to_email text,
  note text,
  approved_request_id uuid references public.referral_requests(id) on delete set null,
  issued_by uuid references auth.users(id) on delete set null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  used_by_user_id uuid references auth.users(id) on delete set null,
  used_by_email text,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'referral_requests_approved_invite_fkey'
  ) then
    alter table public.referral_requests
      add constraint referral_requests_approved_invite_fkey
      foreign key (approved_invite_id) references public.invite_codes(id) on delete set null;
  end if;
end;
$$;

create index if not exists idx_referrals_status on public.referral_requests(status, created_at desc);
create index if not exists idx_referrals_email on public.referral_requests(lower(email));
create index if not exists idx_invites_status on public.invite_codes(status, issued_at desc);
create index if not exists idx_invites_code on public.invite_codes(code);

drop trigger if exists trg_referral_requests_touch on public.referral_requests;
create trigger trg_referral_requests_touch before update on public.referral_requests
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_invite_codes_touch on public.invite_codes;
create trigger trg_invite_codes_touch before update on public.invite_codes
  for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.validate_invite_code(p_code text, p_email text default null)
returns table (valid boolean, reason text, invite_id uuid)
language plpgsql security definer set search_path = public
as $$
declare
  v_invite public.invite_codes;
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
begin
  select * into v_invite from public.invite_codes
  where code = trim(coalesce(p_code, ''))
  order by created_at desc limit 1;

  if v_invite.id is null then
    return query select false, 'Invite code not found.', null::uuid;
    return;
  end if;
  if v_invite.status <> 'active' then
    return query select false, 'Invite code is no longer active.', v_invite.id;
    return;
  end if;
  if v_invite.expires_at is not null and v_invite.expires_at <= now() then
    return query select false, 'Invite code has expired.', v_invite.id;
    return;
  end if;
  if v_invite.issued_to_email is not null and v_email is not null
     and lower(v_invite.issued_to_email) <> v_email then
    return query select false, 'Invite code was issued to a different email.', v_invite.id;
    return;
  end if;
  return query select true, 'ok', v_invite.id;
end;
$$;

revoke all on function public.validate_invite_code(text, text) from public;
grant execute on function public.validate_invite_code(text, text) to anon, authenticated;

-- Anonymous referral submissions (bypasses RLS; safe validation inside function).
create or replace function public.submit_referral_request(
  p_full_name text,
  p_email text,
  p_reason text,
  p_referrer_name text default null,
  p_referrer_email text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if char_length(trim(coalesce(p_full_name, ''))) < 2 then
    raise exception 'Name is required.';
  end if;
  if position('@' in trim(coalesce(p_email, ''))) < 2 then
    raise exception 'Valid email is required.';
  end if;
  if char_length(trim(coalesce(p_reason, ''))) < 8 then
    raise exception 'Please share a bit more about why you want access.';
  end if;

  insert into public.referral_requests (
    full_name, email, reason, referrer_name, referrer_email, status
  )
  values (
    trim(p_full_name),
    lower(trim(p_email)),
    trim(p_reason),
    nullif(trim(coalesce(p_referrer_name, '')), ''),
    nullif(lower(trim(coalesce(p_referrer_email, ''))), ''),
    'pending'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_referral_request(text, text, text, text, text) from public;
grant execute on function public.submit_referral_request(text, text, text, text, text) to anon, authenticated;

alter table public.referral_requests enable row level security;
alter table public.invite_codes enable row level security;

drop policy if exists "referrals submit anon" on public.referral_requests;
create policy "referrals submit anon" on public.referral_requests
  for insert to anon with check (
    status = 'pending' and reviewed_by is null and reviewed_at is null and approved_invite_id is null
  );

drop policy if exists "referrals submit auth" on public.referral_requests;
create policy "referrals submit auth" on public.referral_requests
  for insert to authenticated with check (
    status = 'pending' and reviewed_by is null and reviewed_at is null and approved_invite_id is null
  );

drop policy if exists "referrals admin all" on public.referral_requests;
create policy "referrals admin all" on public.referral_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "invites admin all" on public.invite_codes;
create policy "invites admin all" on public.invite_codes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.referral_requests to authenticated;
grant insert on public.referral_requests to anon;
grant select, insert, update, delete on public.invite_codes to authenticated;

-- Supabase Auth → URL Configuration: add redirect URLs for password reset:
--   https://kidquest-indol.vercel.app/reset-password
--   http://localhost:5173/reset-password

-- Promote admin (edit email):
-- update public.profiles set role = 'admin', email = 'jvinaymohan@gmail.com'
-- where id = (select id from auth.users where email = 'jvinaymohan@gmail.com' limit 1);
