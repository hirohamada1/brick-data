-- Add structured search parameters to watchlists
-- These columns store the user's search criteria and are used to
-- auto-generate the ImmobilienScout24 search URL.

ALTER TABLE watchlists
  ADD COLUMN IF NOT EXISTS location_label text,
  ADD COLUMN IF NOT EXISTS location_path  text,
  ADD COLUMN IF NOT EXISTS price_min      numeric,
  ADD COLUMN IF NOT EXISTS price_max      numeric,
  ADD COLUMN IF NOT EXISTS area_min       numeric,
  ADD COLUMN IF NOT EXISTS area_max       numeric,
  ADD COLUMN IF NOT EXISTS rooms_min      numeric,
  ADD COLUMN IF NOT EXISTS rooms_max      numeric;
