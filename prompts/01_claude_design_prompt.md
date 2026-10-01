# Prompt — Claims Revenue Leakage storytelling prototype

Paste everything below the line into Claude Design (or Claude Code). It is self-contained.

---

## Role and goal

You are a senior BI product designer and React engineer. Build an interactive prototype called
**"Claims Revenue Leakage"** (Decision Product ID `DP-CLM-01`) for Andalusia Group's Revenue Cycle.
It must tell one diagnostic story across **5 pages**, following the Andalusia Enterprise Reporting
standard (diagnostic-first): **Outcome → Output → Process → Input → Action**.

Decision question (show in the header on every page):
> Why are we losing value on rejected claims, and what should we do this week?

## Hard rules

1. **No scrolling.** Each page fits exactly one screen at 1920×1080 and 1366×768. Use a 100vh CSS grid:
   header, story stepper, page canvas (1fr), footer. Charts size to their container.
2. **Use only the numbers in the data section.** Do not invent trends, targets, monthly series or causes.
   Every figure shows its period next to it.
3. Where evidence is missing, show a visible **diagnostic gap** (dashed amber border, "Owner needed"),
   never a guessed cause.
4. Label each diagnostic panel with its strength: **Contextual**, **Associative** or **Attributive**.
5. Separate **Certification: Draft** and **Operational state: D3 · Needs decision** as two chips.
6. Footer on every page: "Powered by BI Team · Source: NPHIES via Basirah Gold · Data reliable from 2025-11-01".
7. Owners are **roles**, marked "to confirm". Never name people.
8. Add a **"Mask payers"** toggle that replaces payer names with Payer A, B, C… everywhere, including the assistant.

## Visual direction

Dark, modern, high-contrast, glowing (like a premium operations wall display).

| Token | Hex | Use |
|---|---|---|
| Background | `#060918` with soft radial glows of blue and violet | canvas |
| Panel | `rgba(16,22,56,.72)`, 1px border `rgba(129,140,248,.16)`, radius 16 | cards |
| Text / secondary / muted | `#EAEEFF` / `#B6BDE6` / `#7D86B8` | type |
| Outcome | `#FF4FA3` | stage colour |
| Output | `#FFB547` | stage colour |
| Process | `#22D3A6` | stage colour |
| Input | `#3B8BFF` | stage colour |
| Action | `#A855F7` | stage colour |
| AI accent | `#4F46E5 → #7C3AED` gradient, AI surfaces only | assistant |
| Good / warn / bad | `#34D399` / `#FBBF24` / `#FB7185` | status |

Fonts: Sora (headings, big numbers), Manrope (body), JetBrains Mono (IDs, dates). Tabular numerals.
Stage colour is never the only signal: pair it with a text badge (Oc, O, P, I, A).

## Layout on every page

- **Header:** logo mark, product name + ID, decision question (centre), chips (Certification, State, Owner),
  Mask payers toggle, gradient "✦ Ask Basirah" button.
- **Stepper:** 5 clickable steps with stage code, name and question; the active step glows in its stage colour.
  Keyboard ← → moves between pages; the URL hash (#outcome…#action) deep-links.
- **Story line:** stage badge + one headline sentence with the key number highlighted in the stage colour.
- **KPI row:** 4 cards (label, period, big value + unit, one-line context, optional flag).
- **Canvas:** 2–3 panels + a "So what" insight card with a "Next →" button to the next page.

## Page content and data

### 1 · Outcome — How much value are we losing?
Headline: "We lost **18.6M** to rejections in August, and **40%** of it came with no reason from the payer."
KPIs: Rejection value 18.59M SAR (Aug 2026) · Sent with no reason 7.49M (NCCI 6.02M, Med Gulf 1.43M; flag
"40.3% unexplained") · Target/baseline "Not set" (flag "D1 gap · owner needed") · Rejected + partial value
159.5M SAR (Nov 2025 – Sep 2026, 5 payers with recorded amounts).
Panel A (Attributive) — horizontal bars, Aug 2026, SAR M: No reason sent by payer 7.49 (striped amber = gap) ·
Missing documents 3.53 (188 claims) · Contract/pricing 3.31 · Medical necessity 2.08 · Pre-auth not obtained 1.64 ·
Late submission 0.54 (24 claims, lost).
Panel B (Contextual) — vertical bars, cumulative, SAR M: Bupa 72.78 · NCCI 63.41 · MOH 15.51 · Med Gulf 5.90 ·
Al Rajhi 1.89. Note: TCS group, Arabian Shield, TUCI, Gulf Union and AXA record no claimed amount, so they are
excluded rather than shown as zero.
Insight: the largest slice is missing information; missing documents is the biggest reason we control. Add a 100%
stacked share bar of the six reasons.

### 2 · Output — Which decisions drive it?
Headline: "In July, **57%** of decided claims were not fully approved, and most of those were cut rather than refused."
KPIs (Jul 2026): Submitted 16,364 · Decided 13,658 (83.5%) · Not fully approved 7,804 (57.1% of decided; 5,468
partial, 2,336 rejected) · Recovered by the team 797 (plus 598 re-decided by the payer).
Panel A (Attributive) — donut: Approved 5,854 · Partially approved 5,468 · Rejected 2,336 · Awaiting decision 2,204 ·
Errors 502; centre label 16,364; chip "✓ Closes to 16,364".
Panel B (Attributive) — bars: Resubmitted 1,073 · Recovered by team 797 · Re-decided by payer 598 (grey).
Insight: partially approved usually means the payer cut quantity or price; counting payer re-decisions as team work
would overstate the team by 75%.

### 3 · Process — Is the team working the rejections?
Headline: "**Two in three** rejected or partial claims never get a Communication, and the old alert was hiding it."
KPIs: No Communication 67% (70,665 of 105,882, cumulative) · Recovery rate 24.9% (15,323 of ~61K ever rejected,
~20 days) · Submission SLA met 48.3% (from statement end date; 2.6% if from visit date) · Old alert vs reality
"2 → 329" (TCS-Arabian Shield, July statement).
Panel A (Associative) — donut: No Communication 70,665 vs Communication raised 35,217. Note: some claims are
resent without a Communication (NCCI 14.5%), so "worked" = Communication OR resend.
Panel B (Attributive) — "One statement, two truths": Claims on statement 506 · Needing work 401 · Communication
raised 72 · No Communication 329 · Untouched 315 · Old alert showed 2 (red).
Panel C (Associative) — days to act after a decision: Human rework 20 · NCCI resend 2 · Med Gulf resend 1 ·
Bupa resend 1 ("is NCCI resubmission automated?").

### 4 · Input — What constrains the team?
Headline: "The biggest blockers sit **outside the team**: payers that send no reasons, no amounts, and late final decisions."
KPIs: Items with a reason from NCCI + Med Gulf: 14 of 51,323 (Jun – Sep 2026) · Claims with no claimed amount 29.9%
(31,688 of 105,882) · NCCI final decision lands after 4–6 weeks · Staffing & workload data "None" (flag "Diagnostic gap").
Panel A (Contextual) — constraint × payer heat matrix (red blocking, amber material, blue minor, dashed unknown).
Columns: NCCI, Med Gulf, Bupa, MOH, Al Rajhi, TCS group.
- Rejection reason not sent: None sent · None sent · Sent · Sent · Sent · Unknown
- Claimed amount not recorded: OK · OK · Handled · OK · ~42% · 100%
- Final decision arrives in batches: 4–6 wks · — · Monthly · — · — · Unknown
- Visit billed in two statements: — · 1,089 claims · — · — · — · —
- NPHIES bundle validation errors: — · — · Chronic · — · — · —
- Statements closed, not sent: 0.96M · — · 4.35M · 1.16M · — · —
Panel B — timeline of NCCI final adjudication batches 2026: 05-18, 06-08, 06-15, 07-13, 08-24.
Panel C — diagnostic gaps needing an owner: Staffing & workload (no data, RCM ops) · Per-payer SLA from contracts
(not loaded; flat 7-day target is wrong; Contracts + BI) · Canonical payer names (duplicates split payers; BI dbt seed).

### 5 · Action — What do we do this week?
Headline: "Six actions, each with a trigger, an owner and evidence. **Start with 188 claims worth 3.53M.**"
KPIs: Quick win missing documents 3.53M (188 claims, ~18.8K each; "Inside our control") · Closed, never sent to
NPHIES 6.74M (Nov 2025 – Aug 2026; Bupa 4.35M, MOH 1.16M, NCCI 0.96M) · Med Gulf "already linked to batch" 0.85M
(1,089 claims, none resent) · Lost for good, late submission 0.54M (24 claims).
Panel A — action board table (Action | Trigger | Owner role | Value at stake + period | Evidence | Status):
1. Work missing-documents rejections first | reason group = missing documents | Follow-up team lead | 3.53M · 188 claims (Aug 2026) | Communication or resend → final decision | Proposed
2. Send closed statements to NPHIES | statement closed with no Request | Billing lead | 6.74M (Nov 2025 – Aug 2026) | Request created → payer decision | Proposed
3. Re-link Med Gulf visits billed twice | "Already linked to batch" | Billing supervisor | 0.85M · 1,089 claims | Resend accepted | Proposed
4. Ask NCCI & Med Gulf for item reasons | rejected item with no reason | RCM Director | explains 7.49M | reason populated | Proposed
5. Daily resubmission alert, 80% money gate | ≥80% of billed money decided | BI Team | backlog made visible | email from one claim-grain table | In progress
6. Stop late submissions at the source | days since statement end > payer limit | Billing lead | 0.54M lost · 24 claims | no late-submission rejections | Proposed
Panel B — value at stake bars (periods differ, not summed): 6.74 · 3.53 · 0.85 · 0.54 (red).
Panel C — closed loop: Trigger → Decision → Action → Done? (execution evidence) → Moved? (outcome evidence) → Value (signed off).

## "Ask Basirah" assistant (demo)

A panel that opens under the header (gradient border, "AI" pill, subtitle "Demo · scripted answers from verified
findings"). Suggestion chips: Why is 7.49M unexplained? · What is the quick win? · Team vs payer recovery ·
What does 67% mean? · Which payers block us? · Take me to the action plan.
Match questions by keywords to scripted answers built only from the data above. Each answer shows a confidence badge
(High / Medium / Low / Preliminary), a source line and 👍/👎, and opens the page it refers to. Unknown questions get:
"I only answer from the verified findings in this prototype." Show a typing indicator for ~0.6 s.

## Accessibility and delivery

WCAG 2.1 AA contrast, visible focus rings, keyboard navigation, reduced-motion respected.
Below 1100px wide, stack panels and allow scrolling.
Deliver as a Vite + React project with a multi-stage Dockerfile (node:20-alpine build → nginx:alpine),
`docker-compose.yml` mapping 8080:80, and bundled fonts (no external calls at runtime).
