# src/services/calculator.py
#
# Dieser Service enthält die finanzielle Berechnungslogik für Immobilien-Listings.
# Er ist bewusst unabhängig von der Datenbank – reine Python-Mathematic.
# Input: CalcInputs (Daten aus l1_listings + watchlists.defaults)
# Output: CalcResult (alle berechneten Kennzahlen)

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Literal

# Typ für den Zielmodus: Entweder Nettorendite oder Cashflow als Zielgröße
Zielmodus = Literal["nettorendite", "cashflow"]


@dataclass(frozen=True)
class CalcInputs:
    """Alle Eingabedaten für eine Berechnung.

    Quellen (in Priorität):
      1. manual_inputs   → vom User manuell überschrieben
      2. watchlists.defaults → vom User bei Watchlist-Erstellung gesetzt
      3. Fallback-Werte  → fest kodierte Standardwerte im Runner
    """

    # --- Aus l1_listings (Scraper-Daten) ---
    kaufpreis_eur: float        # Kaufpreis des Objekts in EUR
    flaeche_qm: float           # Wohnfläche in qm

    # --- Mietannahmen (aus defaults / manual_inputs) ---
    kaltmiete_pro_qm: float     # Angenommene Kaltmiete pro qm/Monat in EUR

    # --- Hausgeld (als Prozentsatz der Kaltmiete, z.B. 0.25 = 25%) ---
    # Umlagefähig = wird auf Mieter umgelegt (z.B. Wasser, Hausmeister)
    # Nicht umlagefähig = bleibt beim Eigentümer (z.B. Instandhaltungsrücklage)
    hausgeld_umlagefaehig_prozent_miete: float
    hausgeld_nicht_umlagefaehig_prozent_miete: float

    # --- Bewirtschaftungskosten ---
    mietausfall_prozent: float              # Leerstand/Mietausfall in Dezimal (0.03 = 3%)
    instandhaltung_eur_pro_qm_monat: float  # Instandhaltungsrücklage in EUR/qm/Monat

    # --- Finanzierung ---
    zinssatz: float      # Nominalzinssatz p.a. in Dezimal (0.04 = 4%)
    tilgungssatz: float  # Tilgungssatz p.a. in Dezimal (0.02 = 2%)

    # --- Kaufnebenkosten (als Prozentsatz des Kaufpreises) ---
    notarkosten_prozent: float          # Notar- und Beglaubigungskosten (typ. 1.5%)
    grunderwerbssteuer_prozent: float   # Je nach Bundesland (z.B. 5% in BW)
    grundbuchkosten_prozent: float      # Eintragung im Grundbuch (typ. 0.5%)

    # --- Zielplanung ---
    zielmodus: Zielmodus                            # 'nettorendite' oder 'cashflow'
    ziel_nettorendite: Optional[float] = None       # Ziel-Nettorendite in % (z.B. 4.5)
    ziel_cashflow_eur_monat: Optional[float] = None # Ziel-Cashflow in EUR/Monat
    erlaubte_abweichung: Optional[float] = None     # Toleranz (Prozentpunkte oder EUR)


@dataclass(frozen=True)
class CalcResult:
    """Alle berechneten Kennzahlen als Ergebnis."""

    # Miete
    kaltmiete_eur_monat: float          # Rohe Kaltmiete (Fläche × Kaltmiete/qm)
    effektive_miete_eur_monat: float    # Kaltmiete nach Mietausfallabzug

    # Hausgeld (in EUR/Monat)
    hausgeld_total_eur_monat: float                 # Gesamt (umlagefähig + nicht umlagefähig)
    hausgeld_nicht_umlagefaehig_eur_monat: float    # Nur der Träger-Anteil des Eigentümers

    # Bewirtschaftung
    instandhaltung_eur_monat: float     # Rücklage für Reparaturen

    # Kernergebnisse
    noi_eur_monat: float            # Net Operating Income: Einnahmen minus Eigentumskosten
    cashflow_eur_monat: float       # Cashflow nach Finanzierungskosten (Zinsen + Tilgung)
    nettorendite_prozent_pa: float  # Jährliche Nettorendite auf Gesamtinvestition in %
    dscr: float                     # Debt Service Coverage Ratio: NOI / Schuldendienst

    # Zielabweichung
    ziel_abweichung: Optional[float]  # Differenz zum Ziel (positiv = besser als Ziel)
    ziel_erfuellt: Optional[bool]     # True wenn innerhalb der erlaubten Abweichung


def _nonneg(x: float) -> float:
    """Hilfsfunktion: stellt sicher, dass kein negativer Wert in die Berechnung eingeht."""
    return float(x) if float(x) > 0 else 0.0


def calculate(i: CalcInputs) -> CalcResult:
    """Hauptberechnung für ein Listing.

    Ablauf:
      1. Brutto-Kaltmiete
      2. Effektive Miete (nach Mietausfall)
      3. Hausgeld (% der Kaltmiete)
      4. Instandhaltung
      5. NOI (Net Operating Income)
      6. Finanzierungskosten (Zinsen + Tilgung)
      7. Cashflow
      8. Kaufnebenkosten + Gesamtinvestition
      9. Nettorendite p.a.
      10. DSCR
      11. Zielabweichung
    """
    # Eingabewerte absichern (keine negativen Zahlen in der Rechnung)
    kaufpreis  = _nonneg(i.kaufpreis_eur)
    flaeche    = _nonneg(i.flaeche_qm)
    mietausfall = _nonneg(i.mietausfall_prozent)

    # ──────────────────────────────────────────────
    # SCHRITT 1: Brutto-Kaltmiete
    # Formel: Fläche [qm] × Kaltmiete/qm [EUR] = monatliche Kaltmiete [EUR]
    # ──────────────────────────────────────────────
    kaltmiete = flaeche * _nonneg(i.kaltmiete_pro_qm)

    # ──────────────────────────────────────────────
    # SCHRITT 2: Effektive Miete (nach Mietausfall)
    # Mietausfall berücksichtigt Leerstand oder Mietnomaden.
    # Formel: Kaltmiete × (1 - Mietausfall%) = effektive Einnahme
    # Beispiel: 1.000 EUR × (1 - 0.03) = 970 EUR
    # ──────────────────────────────────────────────
    effektive_miete = kaltmiete * (1.0 - min(mietausfall, 1.0))

    # ──────────────────────────────────────────────
    # SCHRITT 3: Hausgeld (als Prozentsatz der Kaltmiete)
    # Hausgeld = monatliche Betriebskosten für Eigentümer (z.B. Verwaltung, Gemeinschaftsflächen)
    # Umlagefähiger Anteil → wird auf Mieter umgelegt (Warmmiete), belastet den Eigentümer NICHT
    # Nicht-umlagefähiger Anteil → bleibt beim Eigentümer (z.B. Instandhaltungsrücklage)
    # Formel: Kaltmiete × Prozentsatz
    # Beispiel: 1.000 EUR × 0.25 = 250 EUR gesamt; davon 125 EUR nicht umlagefähig
    # ──────────────────────────────────────────────
    hg_umlage_monat = kaltmiete * _nonneg(i.hausgeld_umlagefaehig_prozent_miete)
    hg_nicht_monat  = kaltmiete * _nonneg(i.hausgeld_nicht_umlagefaehig_prozent_miete)
    hg_total_monat  = hg_umlage_monat + hg_nicht_monat

    # ──────────────────────────────────────────────
    # SCHRITT 4: Instandhaltungsrücklage
    # Rücklage für Reparaturen und Renovierungen, fließt nicht in die Miete ein.
    # Formel: Fläche [qm] × Instandhaltung/qm/Monat [EUR]
    # Beispiel: 75 qm × 2 EUR = 150 EUR/Monat
    # ──────────────────────────────────────────────
    instandhaltung_monat = flaeche * _nonneg(i.instandhaltung_eur_pro_qm_monat)

    # ──────────────────────────────────────────────
    # SCHRITT 5: NOI – Net Operating Income (monatlich)
    # Einnahmen minus laufende Eigentumskosten (OHNE Finanzierung).
    # Wir rechnen mit Kaltmiete (effektiv), da Betriebskosten separat laufen.
    # Abgezogen wird NUR der nicht-umlagefähige Hausgeld-Anteil (Eigentümerlast)
    # sowie die Instandhaltungsrücklage.
    # Formel: NOI = effektive Miete - nicht-umlagefähiges Hausgeld - Instandhaltung
    # ──────────────────────────────────────────────
    noi = effektive_miete - hg_nicht_monat - instandhaltung_monat

    # ──────────────────────────────────────────────
    # SCHRITT 6: Finanzierungskosten
    # Zinsen und Tilgung berechnen sich aus dem Kaufpreis × jeweiligem Prozentsatz p.a. / 12.
    # Formel Zinsen: Kaufpreis × Zinssatz / 12
    # Formel Tilgung: Kaufpreis × Tilgungssatz / 12
    # ──────────────────────────────────────────────
    zinsen_monat    = kaufpreis * _nonneg(i.zinssatz) / 12.0
    tilgung_monat   = kaufpreis * _nonneg(i.tilgungssatz) / 12.0
    schuldendienst  = zinsen_monat + tilgung_monat  # Gesamte monatliche Kreditrate

    # ──────────────────────────────────────────────
    # SCHRITT 7: Cashflow (monatlich)
    # Was bleibt nach ALLEN Kosten (Bewirtschaftung + Finanzierung) übrig?
    # Positiver Cashflow = Immobilie "ernährt" sich selbst und bringt Überschuss.
    # Negativer Cashflow = Eigentümer muss monatlich zuzahlen.
    # Formel: Cashflow = NOI - Zinsen - Tilgung
    # ──────────────────────────────────────────────
    cashflow = noi - schuldendienst

    # ──────────────────────────────────────────────
    # SCHRITT 8: Kaufnebenkosten + Gesamtinvestition
    # Kaufnebenkosten = einmalige Zusatzkosten beim Kauf (Notar, Steuer, Grundbuch).
    # Formel: Kaufpreis × (Notar% + GrESt% + Grundbuch%)
    # Gesamtinvestition = Kaufpreis + Kaufnebenkosten (Basis für Renditevergleich)
    # ──────────────────────────────────────────────
    kaufnebenkosten = kaufpreis * (
        _nonneg(i.notarkosten_prozent)
        + _nonneg(i.grunderwerbssteuer_prozent)
        + _nonneg(i.grundbuchkosten_prozent)
    )
    gesamtinvest = kaufpreis + kaufnebenkosten

    # ──────────────────────────────────────────────
    # SCHRITT 9: Nettorendite p.a.
    # Anteil des NOI an der Gesamtinvestition (annualisiert), in Prozent.
    # Vergleichbar mit einem Zinssatz: "Was bekomme ich für mein eingesetztes Kapital zurück?"
    # Formel: (NOI/Monat × 12) / Gesamtinvestition × 100
    # Beispiel: (600 × 12) / 270.000 × 100 = 2.67%
    # ──────────────────────────────────────────────
    nettorendite_pa = (noi * 12.0) / gesamtinvest * 100.0 if gesamtinvest > 0 else 0.0

    # ──────────────────────────────────────────────
    # SCHRITT 10: DSCR – Debt Service Coverage Ratio
    # Misst, ob der NOI den Schuldendienst deckt.
    # DSCR > 1.0 = NOI reicht für Raten. DSCR < 1.0 = Eigentümer muss zuzahlen.
    # Formel: DSCR = NOI / Schuldendienst
    # Beispiel: 600 / 1.250 = 0.48 → der Eigentümer zahlt deutlich zu
    # ──────────────────────────────────────────────
    dscr = noi / schuldendienst if schuldendienst > 0 else 0.0

    # ──────────────────────────────────────────────
    # SCHRITT 11: Zielabweichung
    # Vergleich des berechneten Werts mit dem Zielwert aus den User-Einstellungen.
    # Positiv = besser als Ziel, Negativ = schlechter als Ziel.
    # ziel_erfuellt = True, wenn die Abweichung innerhalb der Toleranz liegt.
    # ──────────────────────────────────────────────
    ziel_abweichung: Optional[float] = None
    ziel_erfuellt: Optional[bool]    = None
    tol = float(i.erlaubte_abweichung) if i.erlaubte_abweichung is not None else 0.0

    if i.zielmodus == "nettorendite" and i.ziel_nettorendite is not None:
        # Abweichung in Prozentpunkten (z.B. 2.67% - 4.5% = -1.83pp)
        ziel_abweichung = nettorendite_pa - float(i.ziel_nettorendite)
        ziel_erfuellt   = ziel_abweichung >= -abs(tol)

    elif i.zielmodus == "cashflow" and i.ziel_cashflow_eur_monat is not None:
        # Abweichung in EUR/Monat (z.B. -750 EUR - 0 EUR = -750 EUR)
        ziel_abweichung = cashflow - float(i.ziel_cashflow_eur_monat)
        ziel_erfuellt   = ziel_abweichung >= -abs(tol)

    return CalcResult(
        kaltmiete_eur_monat=kaltmiete,
        effektive_miete_eur_monat=effektive_miete,
        hausgeld_total_eur_monat=hg_total_monat,
        hausgeld_nicht_umlagefaehig_eur_monat=hg_nicht_monat,
        instandhaltung_eur_monat=instandhaltung_monat,
        noi_eur_monat=noi,
        cashflow_eur_monat=cashflow,
        nettorendite_prozent_pa=nettorendite_pa,
        dscr=dscr,
        ziel_abweichung=ziel_abweichung,
        ziel_erfuellt=ziel_erfuellt,
    )