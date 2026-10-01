// Every figure below comes from verified Basirah validation runs (NPHIES claims, AHJ source).
// Each block carries its period so the UI can label it. Nothing here is a forecast or a target.

export const PRODUCT = {
  id: 'DP-CLM-01',
  title: 'Claims Revenue Leakage',
  question: 'Why are we losing value on rejected claims, and what should we do this week?',
  owner: 'Revenue Cycle Director (to confirm)',
  source: 'NPHIES via Basirah Gold (Delta Lake → ClickHouse)',
  certification: 'Draft',
  state: 'D3 · Needs decision',
  reliableFrom: '2025-11-01',
};

export const BRIEF = { key: 'brief', code: '★', name: 'Brief', q: 'The 60-second story', color: 'var(--ai-2)' };

export const gaugesJul = [
  { label: 'Fully approved', value: 42.9, per: 'Jul 2026 · of decided', color: '#5cc29b' },
  { label: 'Submission SLA met', value: 48.3, per: 'Cumulative', color: '#e0aa5e' },
  { label: 'Communication raised', value: 33.3, per: 'Cumulative · rejected + partial', color: '#52b8a6' },
  { label: 'Recovered after rejection', value: 24.9, per: 'Cumulative', color: '#6e9be6' },
];

export const ceoDecisions = [
  { t: 'Escalate with NCCI and Med Gulf', d: 'Ask for item-level rejection reasons. Only 14 of 51,323 of their rejected items carry one, and 7.49M in August has no explanation.' },
  { t: 'Clear the unsent-statement backlog', d: '6.74M in closed statements never reached NPHIES (Bupa, MOH, NCCI). Name a billing owner and a date.' },
  { t: 'Approve targets and owners', d: 'Rejection value, recovery rate and submission SLA have no approved target, so no variance can be reported yet.' },
];

export const STAGES = [
  { key: 'outcome', code: 'Oc', name: 'Outcome', q: 'How much value are we losing?', color: 'var(--outcome)' },
  { key: 'output', code: 'O', name: 'Output', q: 'Which decisions drive it?', color: 'var(--output)' },
  { key: 'process', code: 'P', name: 'Process', q: 'Is the team working the rejections?', color: 'var(--process)' },
  { key: 'input', code: 'I', name: 'Input', q: 'What constrains the team?', color: 'var(--input)' },
  { key: 'action', code: 'A', name: 'Action', q: 'What do we do this week?', color: 'var(--action)' },
];

// ---------- 1 · OUTCOME ----------
export const rejectionByReason = {
  period: 'August 2026',
  unit: 'SAR M',
  rows: [
    { short: 'No reason', reason: 'No reason sent by payer', value: 7.49, gap: true, note: 'NCCI 6.02M · Med Gulf 1.43M' },
    { short: 'Missing docs', reason: 'Missing documents', value: 3.53, claims: 188 },
    { short: 'Contract', reason: 'Contract / pricing', value: 3.31 },
    { short: 'Necessity', reason: 'Medical necessity', value: 2.08 },
    { short: 'Pre-auth', reason: 'Pre-auth not obtained', value: 1.64 },
    { short: 'Late', reason: 'Late submission', value: 0.54, claims: 24, lost: true },
  ],
};
export const rejectionTotal = rejectionByReason.rows.reduce((s, r) => s + r.value, 0); // 18.59

export const valueByPayer = {
  period: 'Nov 2025 – Sep 2026 (cumulative)',
  unit: 'SAR M',
  note: 'Claimed value of rejected + partially approved claims. TCS group, Arabian Shield, TUCI, Gulf Union and AXA record no claimed amount, so they are excluded here rather than shown as zero.',
  rows: [
    { payer: 'Bupa', value: 72.78 },
    { payer: 'NCCI', value: 63.41 },
    { payer: 'MOH', value: 15.51 },
    { payer: 'Med Gulf', value: 5.9 },
    { payer: 'Al Rajhi', value: 1.89 },
  ],
};
export const valueByPayerTotal = valueByPayer.rows.reduce((s, r) => s + r.value, 0); // 159.49

// ---------- 2 · OUTPUT ----------
export const funnel = {
  period: 'July 2026 (statement month, after the 20 Sep rebuild)',
  submitted: 16364,
  rows: [
    { k: 'Approved', v: 5854, tone: 'good' },
    { k: 'Partially approved', v: 5468, tone: 'warn' },
    { k: 'Rejected', v: 2336, tone: 'bad' },
    { k: 'Awaiting decision', v: 2204, tone: 'muted' },
    { k: 'Errors', v: 502, tone: 'muted' },
  ],
};
export const decided = 5854 + 5468 + 2336; // 13,658
export const notFullyApproved = 5468 + 2336; // 7,804

export const recovery = {
  period: 'July 2026',
  resubmitted: 1073,
  byTeam: 797,
  byPayer: 598,
};

// ---------- 3 · PROCESS ----------
export const communication = {
  period: 'Nov 2025 – Sep 2026 (cumulative)',
  total: 105882,
  noComm: 70665,
};
export const recoveryRate = { recovered: 15323, everRejected: 61000, avgDays: 20 };
export const sla = { fromStatementEnd: 48.3, fromVisitDate: 2.6 };
export const reworkDays = {
  rows: [
    { k: 'Human rework (known)', short: 'Human rework', v: 20 },
    { k: 'NCCI resend after decision', short: 'NCCI resend', v: 2 },
    { k: 'Med Gulf resend after decision', short: 'Med Gulf resend', v: 1 },
    { k: 'Bupa resend after decision', short: 'Bupa resend', v: 1 },
  ],
};
export const caseStudy = {
  statement: 'TCS-Arabian Shield · July 2026 statement',
  rows: [
    { k: 'Claims on statement', short: 'Claims on statement', v: 506 },
    { k: 'Needing work (rejected + partial)', short: 'Needing work', v: 401 },
    { k: 'Communication raised', short: 'Communication raised', v: 72 },
    { k: 'No Communication', short: 'No Communication', v: 329, warn: true },
    { k: 'Untouched (no Communication, no resend)', short: 'Untouched', v: 315, warn: true },
    { k: 'Shown by the old alert', short: 'Old alert showed', v: 2, alert: true },
  ],
};

// ---------- 4 · INPUT ----------
export const inputKpis = {
  reasons: { withReason: 14, items: 51323, period: 'Jun – Sep 2026' },
  noAmount: { claims: 31688, of: 105882 },
};
export const payersMatrix = ['NCCI', 'Med Gulf', 'Bupa', 'MOH', 'Al Rajhi', 'TCS group'];
// level: 3 = blocking, 2 = material, 1 = minor / handled, 0 = not affected, null = unknown
export const constraints = [
  {
    name: 'Rejection reason not sent',
    cells: [[3, 'None sent'], [3, 'None sent'], [0, 'Sent'], [0, 'Sent'], [0, 'Sent'], [null, 'Unknown']],
  },
  {
    name: 'Claimed amount not recorded',
    cells: [[0, 'OK'], [0, 'OK'], [1, 'Handled'], [0, 'OK'], [2, '~42%'], [3, '100%']],
  },
  {
    name: 'Final decision arrives in batches',
    cells: [[3, '4–6 wks'], [0, '—'], [2, 'Monthly'], [0, '—'], [0, '—'], [null, 'Unknown']],
  },
  {
    name: 'Visit billed in two statements',
    cells: [[0, '—'], [3, '1,089 claims'], [0, '—'], [0, '—'], [0, '—'], [0, '—']],
  },
  {
    name: 'NPHIES bundle validation errors',
    cells: [[0, '—'], [0, '—'], [2, 'Chronic'], [0, '—'], [0, '—'], [0, '—']],
  },
  {
    name: 'Statements closed, not sent',
    cells: [[1, '0.96M'], [0, '—'], [2, '4.35M'], [2, '1.16M'], [0, '—'], [0, '—']],
  },
];
export const ncciBatches = ['2026-05-18', '2026-06-08', '2026-06-15', '2026-07-13', '2026-08-24'];
export const gaps = [
  { k: 'Staffing & workload per team', v: 'No data in scope', owner: 'RCM ops (to assign)' },
  { k: 'Per-payer SLA from contracts', v: 'Not loaded; a flat 7-day target is wrong', owner: 'Contracts + BI' },
  { k: 'Canonical payer names', v: 'Duplicates split payers (e.g. TCS -Al Sagr / TCS Al Sagr)', owner: 'BI (dbt seed)' },
];

// ---------- 5 · ACTION ----------
export const actions = [
  {
    act: 'Work missing-documents rejections first',
    short: 'Missing documents',
    trigger: 'Rejected, reason group = missing documents',
    owner: 'Follow-up team lead',
    value: '3.53M · 188 claims',
    period: 'Aug 2026',
    evidence: 'Communication or resend logged → final decision',
    status: 'Proposed',
    v: 3.53,
  },
  {
    act: 'Send closed statements to NPHIES',
    short: 'Unsent statements',
    trigger: 'Statement closed with no Request',
    owner: 'Billing lead',
    value: '6.74M (Bupa, MOH, NCCI…)',
    period: 'Nov 2025 – Aug 2026',
    evidence: 'Request created → payer decision',
    status: 'Proposed',
    v: 6.74,
  },
  {
    act: 'Re-link Med Gulf visits billed twice',
    short: 'Med Gulf re-link',
    trigger: 'Rejection: "Already linked to batch"',
    owner: 'Billing supervisor',
    value: '0.85M · 1,089 claims',
    period: 'May – Sep 2026',
    evidence: 'Resend accepted by payer',
    status: 'Proposed',
    v: 0.85,
  },
  {
    act: 'Ask NCCI & Med Gulf for item reasons',
    trigger: 'Rejected item with no reason',
    owner: 'RCM Director',
    value: 'Explains 7.49M',
    period: 'Aug 2026',
    evidence: 'Reason populated on items',
    status: 'Proposed',
    v: null,
  },
  {
    act: 'Daily resubmission alert, 80% money gate',
    trigger: '≥80% of billed money decided',
    owner: 'BI Team',
    value: 'Backlog made visible',
    period: 'Rolling',
    evidence: 'Email from one claim-grain OBT',
    status: 'In progress',
    v: null,
  },
  {
    act: 'Stop late submissions at the source',
    short: 'Late submission (lost)',
    trigger: 'Days since statement end > payer limit',
    owner: 'Billing lead',
    value: '0.54M lost · 24 claims',
    period: 'Aug 2026',
    evidence: 'No late-submission rejections',
    status: 'Proposed',
    v: 0.54,
  },
];

// ---------- Masking ----------
const ALIASES = [
  ['TCS-Arabian Shield', 'Payer G'],
  ['Arabian Shield', 'Payer G'],
  ['TCS group', 'Payer F'],
  ['TCS -Al Sagr', 'Payer F1'],
  ['TCS Al Sagr', 'Payer F1'],
  ['Med Gulf', 'Payer D'],
  ['Al Rajhi', 'Payer E'],
  ['Gulf Union', 'Payer I'],
  ['GLOBEMED', 'Payer H'],
  ['NCCI', 'Payer A'],
  ['Bupa', 'Payer B'],
  ['MOH', 'Payer C'],
  ['TUCI', 'Payer J'],
  ['AXA', 'Payer K'],
];
export function maskText(text, on) {
  if (!on || typeof text !== 'string') return text;
  let t = text;
  for (const [from, to] of ALIASES) t = t.split(from).join(to);
  return t;
}
