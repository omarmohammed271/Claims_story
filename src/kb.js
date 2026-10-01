// Scripted knowledge base for the demo assistant. Answers are written from the verified findings only.
// Each entry: keywords (lower-case), answer, page to open, confidence, source.

export const SUGGESTIONS = [
  'Why is 7.49M unexplained?',
  'What is the quick win?',
  'Team vs payer recovery',
  'What does 67% mean?',
  'Which payers block us?',
  'Take me to the action plan',
];

export const KB = [
  {
    keys: ['7.49', 'unexplained', 'no reason', 'reason', 'why'],
    answer:
      'In August 2026, 7.49M of the 18.59M rejection value arrived with no reason: NCCI 6.02M and Med Gulf 1.43M. Between June and September only 14 of 51,323 of their rejected items carried a reason. We show it as a diagnostic gap with an owner instead of guessing a cause.',
    page: 'outcome',
    confidence: 'High',
    source: 'Item-level ResponseReason, Aug 2026',
  },
  {
    keys: ['quick win', 'quick', 'missing documents', 'documents', 'first', 'priority'],
    answer:
      'Missing documents: 3.53M on only 188 claims in August 2026, about 18.8K per claim. It is the highest value per claim of any reason group, and the fix is inside our control.',
    page: 'action',
    confidence: 'High',
    source: 'Rejection value by reason group, Aug 2026',
  },
  {
    keys: ['team', 'payer', 'recovered', 'recovery', 'recover'],
    answer:
      'July 2026: 797 claims were recovered by the team and 598 by the payer re-deciding on its own (for example Bupa monthly "miscalculation" batches). Only the 797 measure team work. Across all history, 15,323 of about 61K ever-rejected claims were recovered (~24.9%), taking about 20 days.',
    page: 'output',
    confidence: 'High',
    source: 'Gold OBT after the 20 Sep 2026 rebuild',
  },
  {
    keys: ['67', 'communication', 'not worked', 'untouched', 'no communication'],
    answer:
      '70,665 of 105,882 rejected or partially approved claims (67%) have no Communication raised. Some were still resent without one (for NCCI, 14.5% of "no Communication" claims were resubmitted), so "worked" must be Communication OR resend.',
    page: 'process',
    confidence: 'Medium',
    source: 'Gold OBT, Nov 2025 – Sep 2026',
  },
  {
    keys: ['alert', 'old alert', 'arabian', 'shield', 'statement'],
    answer:
      'On the TCS-Arabian Shield July statement, 401 of 506 claims needed work and 329 had no Communication. The old alert showed 2, because of its date window. The new alert reads one claim-grain table with an 80% billed-money gate.',
    page: 'process',
    confidence: 'High',
    source: 'Source vs Gold reconciliation, Sep 2026',
  },
  {
    keys: ['block', 'constraint', 'payers', 'input', 'which payer'],
    answer:
      'Main payer-side constraints: NCCI and Med Gulf send no rejection reasons; NCCI final decisions land in batches every 4–6 weeks; the TCS group records no claimed amount; Med Gulf rejects 1,089 claims as "already linked to batch"; Bupa has chronic NPHIES bundle validation errors.',
    page: 'input',
    confidence: 'High',
    source: 'Validation runs, Sep 2026',
  },
  {
    keys: ['sla', 'late', 'deadline', 'on time', 'compliance'],
    answer:
      'Submission SLA compliance is 48.3% when measured from the statement end date, which is the correct anchor. Measured from the visit date it would read 2.6%. Each payer has its own SLA in its contract, so a flat 7-day target is wrong. Late submission lost 0.54M on 24 claims in August.',
    page: 'process',
    confidence: 'Medium',
    source: 'Gold OBT; contracts not yet loaded',
  },
  {
    keys: ['unsent', 'not sent', 'closed', 'statements'],
    answer:
      'From Nov 2025 to Aug 2026, about 6.74M sits in closed statements never sent to NPHIES for payers that normally use it (Bupa 4.35M, MOH 1.16M, NCCI 0.96M). TCS-GOSI is billed outside NPHIES and is excluded.',
    page: 'action',
    confidence: 'Medium',
    source: 'VisitMgt.Statement vs Requests',
  },
  {
    keys: ['partial', 'partially'],
    answer:
      'Partially approved usually means the payer cut quantity or price on a line, not that a line was rejected. In July 2026 there were 5,468 partially approved claims against 2,336 rejected.',
    page: 'output',
    confidence: 'High',
    source: 'ClaimItemResponse.StatusID mapping',
  },
  {
    keys: ['staff', 'fte', 'capacity', 'people', 'workload'],
    answer:
      'We do not have staffing or workload data in scope, so this prototype does not claim understaffing. It is listed as a diagnostic gap that needs an owner.',
    page: 'input',
    confidence: 'Low',
    source: 'Diagnostic gap register',
  },
];

const NAV = [
  ['brief', ['brief', 'summary', 'ceo', 'executive']],
  ['outcome', ['outcome', 'value lost', 'losing']],
  ['output', ['output', 'decisions', 'funnel']],
  ['process', ['process page', 'process']],
  ['input', ['input page', 'constraints page']],
  ['action', ['action', 'plan', 'this week']],
];

export function answer(q) {
  const s = q.toLowerCase();
  if (/(take me|go to|open|show me)/.test(s)) {
    for (const [page, words] of NAV) {
      if (words.some((w) => s.includes(w))) {
        return {
          answer: `Opening the ${page[0].toUpperCase() + page.slice(1)} page.`,
          page,
          confidence: 'High',
          source: 'Navigation',
          nav: true,
        };
      }
    }
  }
  let best = null;
  let bestScore = 0;
  for (const e of KB) {
    const score = e.keys.reduce((n, k) => (s.includes(k) ? n + k.length : n), 0);
    if (score > bestScore) {
      best = e;
      bestScore = score;
    }
  }
  if (best) return best;
  return {
    answer:
      'I only answer from the verified findings in this prototype, and I do not have one for that. Try one of the suggestions below.',
    confidence: 'Preliminary',
    source: 'Demo knowledge base',
  };
}
