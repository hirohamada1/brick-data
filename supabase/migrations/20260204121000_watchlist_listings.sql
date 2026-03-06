create table if not exists watchlist_listings (
    user_id UUID REFERENCES public.users(id),
    watchlist_id UUID NOT NULL REFERENCES watchlists(id),
    listing_id UUID NOT NULL REFERENCES l1_listings(id),
    first_seen_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ,
    unique (watchlist_id, listing_id)
);
