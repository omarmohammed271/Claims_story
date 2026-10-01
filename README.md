# Claims Revenue Leakage — Basirah prototype (DP-CLM-01)

A 5-page diagnostic story for NPHIES claims, built to the Andalusia Enterprise Reporting standard
(Operating Reference v3.9, diagnostic-first): **Outcome → Output → Process → Input → Action**.

- React 18 + Vite + Recharts, fonts bundled (works offline)
- Every page fits one screen (tested at 1920×1080 and 1366×768, no scrolling)
- "Ask Basirah" demo assistant: scripted answers from verified findings, with an AI label, confidence, source and 👍/👎
- "Mask payers" toggle replaces payer names with Payer A, B, C… for wider audiences

## Run it with Docker (no React knowledge needed)

You need Docker Desktop (Windows/Mac) or Docker Engine (Linux).

```bash
# 1. unzip the folder, open a terminal inside it, then:
docker compose up -d --build

# 2. open the app
#    http://localhost:8080

# stop it
docker compose down
```

Change the port by editing `8080:80` in `docker-compose.yml` (for example `9090:80`).

## Run it without Docker (developers)

```bash
npm install
npm run dev          # live reload on http://localhost:5173
npm run build        # production files in dist/
npm run build:single # one self-contained HTML file in dist-single/
```

## Where things live

| File | What it holds |
|---|---|
| `src/data.js` | Every number on screen, with its period. Edit here to refresh figures. |
| `src/pages.jsx` | The five story pages |
| `src/kb.js` | The assistant's questions and answers |
| `src/styles.css` | Colours, layout and the no-scroll grid |
| `prompts/` | The Claude Design prompt and the daily prompt log |

## Data notes

- Figures come from Basirah validation runs (Sep 2026). Periods differ by figure and each one is labelled on screen.
- No approved targets exist yet, so the Outcome page shows value lost, not variance to target (flagged as a D1 gap).
- Staffing and workload data are not in scope, so no understaffing claim is made (flagged as a diagnostic gap).
- Owners are roles to be confirmed. Certification status: Draft.

Powered by BI Team.
