# BrickData - Landing Page

Landing Page fuer BrickData: Immobilien-Daten & Preisverlaeufe. Zeigt Features, Demo-Charts und Kontaktformular.

## Sektionen

- **Hero**: Headline und CTA-Buttons
- **Features**: Preisverlaeufe, Alerts & Max-Bietpreis, Angebote managen, Datenvisualisierung
- **Charts**: Demo-Charts (Preisbewegung EUR/m2, Neue Inserate pro Tag) mit Mock-Daten
- **Kontakt**: Formular (Name, E-Mail, Nachricht)

## Tech Stack

- React 19 + TypeScript
- TailwindCSS v4 (@tailwindcss/postcss)
- shadcn/ui (Radix UI)
- recharts (Charts)

## Entwicklung

**Wichtig:** Alle Befehle im Ordner **`apps/frontend`** ausführen:

```bash
cd apps/frontend
npm install
npm run dev
```

- **`npm run dev`** – startet Vite + Lead-API (Node), Leads in `data/leads.json`.
- **`npm run dev:backend`** – startet Vite + Backend Lead-API (Python). Vorher im Backend: `pip install -r requirements.txt`. Für Python: ggf. `python3` statt `python` nutzen.
- **`npm run dev:vite`** – nur Vite (ohne API; Formular /start schlägt dann fehl).

**„command not found“ / Fehler:**  
- `npm run dev` startet jetzt über ein eigenes Skript (ohne `concurrently`).  
- Immer im Ordner **`apps/frontend`** arbeiten: `cd apps/frontend`, dann `npm install` und `npm run dev`.  
- Wenn der Projektpfad Leerzeichen enthält (z. B. „Frontend : landing mit UI“), die Befehle aus diesem Ordner ausführen – das Skript kommt damit zurecht.

## Build

```bash
npm run build
npm run preview
```
