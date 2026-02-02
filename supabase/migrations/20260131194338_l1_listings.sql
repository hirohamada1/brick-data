create table if not exists l1_listings (
    -- Primary key
    id uuid primary key default gen_random_uuid(),

    -- Source identity
    source text not null,
    external_id text not null,

    -- Canonical URL
    url text not null,

    -- Core listing data (normalized)
    title text,
    price_eur numeric,
    living_space_sqm numeric,
    rooms numeric,

    street text,
    house_number text,
    postcode text,
    city text,
    quarter text,

    -- Media
    images jsonb,           -- array of image URLs

    -- Link to last raw snapshot used to build this record
    latest_l0_id uuid references l0_expose_raw (id) on delete set null,

    -- Bookkeeping
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    -- Enforce one canonical record per source expose
    unique (source, external_id)
);

-- Fast lookup by location
create index if not exists l1_listings_location
    on l1_listings (postcode, city);

-- Sorting / dashboards
create index if not exists l1_listings_price
    on l1_listings (price_eur);

create index if not exists l1_listings_updated_at
    on l1_listings (updated_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_l1_listings_updated_at on l1_listings;

create trigger trg_l1_listings_updated_at
before update on l1_listings
for each row
execute function set_updated_at();
