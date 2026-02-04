create table if not exists watchlist_listings (
    user_id uuid references auth.users(id),
    watchlist_id uuid not null references watchlists(id),
    listing_id uuid not null references l1_listings(id),
    first_seen_at timestamptz,
    last_seen_at timestamptz,
    unique (watchlist_id, listing_id)
);
