-- Enable crypto functions if not already present (for UUIDs)
create extension if not exists pgcrypto;

create table if not exists l0_expose_raw (
    -- Surrogate primary key
    id uuid primary key default gen_random_uuid(),

    -- Source system (e.g. "immoscout")
    source text not null,

    -- External ID from source (e.g. expose_id)
    external_id text not null,

    -- Canonical expose URL
    url text not null,

    -- When this expose was scraped
    scraped_at timestamptz not null default now(),

    -- Raw JSON payload (your mapped expose dict)
    raw jsonb not null,

    -- Stable SHA256 hash of raw JSON (for dedupe & versioning)
    raw_hash text not null,

    -- Parser/scraper version that produced this record
    parser_version text,

    -- Optional job/run identifier (future: batch scans)
    run_id uuid,

    -- Audit timestamps
    created_at timestamptz not null default now()
);

create unique index if not exists l0_expose_raw_dedupe
    on l0_expose_raw (source, external_id, raw_hash);


-- Fast lookup by source + external_id (latest versions)
create index if not exists l0_expose_raw_lookup
    on l0_expose_raw (source, external_id);

-- Time-based queries (recent scrapes, debugging)
create index if not exists l0_expose_raw_scraped_at
    on l0_expose_raw (scraped_at desc);