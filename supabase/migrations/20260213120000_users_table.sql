-- ============================================================
-- USERS TABLE
-- ============================================================

create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),

    clerk_id text not null unique,

    first_name text,
    last_name text,
    email text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ============================================================
-- Updated_at Trigger
-- ============================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;

create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();