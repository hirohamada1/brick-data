create table if not exists watchlist_runs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    watchlist_id uuid not null references watchlists(id),
    status text not null check (status in ('queued', 'running', 'done', 'failed')),
    started_at timestamptz,
    finished_at timestamptz,
    error text,
    stats jsonb
);
