-- Berechnungsspalten zu watchlist_listings hinzufügen
-- Diese Spalten werden durch den CalculationLayer nach jedem Scrape-Run befüllt.

ALTER TABLE public.watchlist_listings
    ADD COLUMN IF NOT EXISTS kaufpreis_eur              numeric,
    ADD COLUMN IF NOT EXISTS flaeche_qm                 numeric,
    ADD COLUMN IF NOT EXISTS kaltmiete_eur_monat        numeric,
    ADD COLUMN IF NOT EXISTS effektive_miete_eur_monat  numeric,
    ADD COLUMN IF NOT EXISTS hausgeld_total_eur_monat   numeric,
    ADD COLUMN IF NOT EXISTS instandhaltung_eur_monat   numeric,
    ADD COLUMN IF NOT EXISTS noi_eur_monat              numeric,
    ADD COLUMN IF NOT EXISTS zinsen_eur_monat           numeric,
    ADD COLUMN IF NOT EXISTS tilgung_eur_monat          numeric,
    ADD COLUMN IF NOT EXISTS cashflow_eur_monat         numeric,
    ADD COLUMN IF NOT EXISTS nettorendite_prozent_pa    numeric,
    ADD COLUMN IF NOT EXISTS dscr                       numeric,
    ADD COLUMN IF NOT EXISTS ziel_abweichung            numeric,
    ADD COLUMN IF NOT EXISTS ziel_erfuellt              boolean,
    ADD COLUMN IF NOT EXISTS calc_source                text,       -- 'defaults' | 'manual_inputs'
    ADD COLUMN IF NOT EXISTS calculated_at              timestamptz;
