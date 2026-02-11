SELECT
  COUNT(*) FILTER (WHERE neue_spalte IS NOT NULL) AS filled,
  COUNT(*) FILTER (WHERE neue_spalte IS NULL) AS empty
FROM watchlists;