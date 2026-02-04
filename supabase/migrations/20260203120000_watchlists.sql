create table if not exists watchlists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    name text not null,
    search_url text not null,
    defaults jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists trg_watchlists_updated_at on watchlists;

create trigger trg_watchlists_updated_at
before update on watchlists
for each row
execute function set_updated_at();
