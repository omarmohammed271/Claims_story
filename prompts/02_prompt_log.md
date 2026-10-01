# Cross-developer prompt log — Enterprise Reporting prototypes

One row per prompt. Anyone on the team can reuse a prompt by copying it from `prompts/`.

| Date | Developer | Product / page | Prompt (file or summary) | Output | Issue found → fix |
|---|---|---|---|---|---|
| 2026-09-30 | Omar + Claude | DP-CLM-01 · all 5 pages | `01_claude_design_prompt.md` | React + Docker prototype, 5 pages, assistant demo | Pages scrolled at 1366×768 → fixed-height grid and shorter chart labels |
| 2026-09-30 | Omar + Claude | DP-CLM-01 · Outcome | "Use only verified figures; show missing targets as a D1 gap" | Outcome page with "Target: Not set" card | Earlier draft labelled 1.0M as Approval; the standard treats it as residual → shown as a gap |
| 2026-09-30 | Omar + Claude | DP-CLM-01 · Input | "Constraint × payer matrix, no invented causes" | Heat matrix + gaps list | No staffing data → shown as diagnostic gap, no understaffing claim |
| 2026-09-30 | Omar + Claude | DP-CLM-01 · Assistant | "Scripted assistant with AI label, confidence, source, feedback" | Ask Basirah panel | Must follow masking toggle → answers pass through the same mask |

## Reusable prompt patterns

1. **Grounding:** "Use only the numbers listed below. Every figure must show its period. Do not invent trends or targets."
2. **Honest gaps:** "Where evidence is missing, show a diagnostic gap card with an owner, never a guessed cause."
3. **No-scroll layout:** "Each page fits one screen at 1920×1080 and 1366×768 using a 100vh CSS grid; charts size to their container."
4. **Story:** "Page order Outcome → Output → Process → Input → Action; one headline sentence per page with the key number highlighted."
5. **Standard compliance:** "Header shows decision question, owner role, certification and operational state separately; footer says Powered by BI Team."
