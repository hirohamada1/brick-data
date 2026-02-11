SELECT id, location_label, price_min, defaults
FROM watchlists
ORDER BY created_at DESC
LIMIT 5;