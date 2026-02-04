create table if not exists listing_manual_inputs (
    user_id uuid not null references auth.users(id),
    watchlist_id uuid not null references watchlists(id),
    listing_id uuid not null references l1_listings(id),
    name text,
    search_url text,
    hausgeld numeric,
    notarkosten numeric,
    grunderwerbssteuer numeric,
    grundbuchkosten numeric,
    mietausfall numeric,
    kaltmiete_pro_qm numeric,
    created_at timestamptz not null default now()
);
