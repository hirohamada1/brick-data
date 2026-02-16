-- Create sandbox schema
CREATE SCHEMA IF NOT EXISTS sandbox;

-- Clone existing tables structure
CREATE TABLE IF NOT EXISTS sandbox.l1_listings
(LIKE public.l1_listings INCLUDING ALL);

CREATE TABLE IF NOT EXISTS sandbox.watchlist_runs
(LIKE public.watchlist_runs INCLUDING ALL);

CREATE TABLE IF NOT EXISTS sandbox.watchlist_listings
(LIKE public.watchlist_listings INCLUDING ALL);
