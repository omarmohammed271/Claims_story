import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, LabelList,
} from 'recharts';
import * as D from './data.js';
import { Story, Kpi, Panel, Insight, HBars, Tip, useM, useFx, fmt, pct, makeBar3D, BarDefs, Donut3D, Gauge } from './ui.jsx';

const S = Object.fromEntries(D.STAGES.map((s) => [s.key, s]));
const C = {
  outcome: '#e07a95', output: '#e0aa5e', process: '#52b8a6', input: '#6e9be6', action: '#9a8ceb',
  good: '#5cc29b', warn: '#ddb35a', bad: '#e2808f', muted: '#6b7890', grey: '#3b4455',
};

const PAYER_COLORS = ['#e07a95', '#d98ba2', '#c99aae', '#b5a6bb', '#a2adc6'];
const SHARE_COLORS = ['#ddb35a', '#52b8a6', '#6e9be6', '#9a8ceb', '#c48fcf', '#e2808f'];
function ShareBar({ rows }) {
  const total = rows.reduce((s, x) => s + x.value, 0);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ color: 'var(--muted)', fontSize: '.8em', marginBottom: 6 }}>Share of August rejection value</div>
      <div style={{ display: 'flex', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2 }}>
        {rows.map((x, i) => (
          <div key={x.reason} title={`${x.reason}: ${pct(x.value, total)}`}
            style={{ width: `${(x.value / total) * 100}%`, background: SHARE_COLORS[i], }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 10px', marginTop: 10, fontSize: '.86em' }}>
        {rows.map((x, i) => (
          <React.Fragment key={x.reason}>
            <span style={{ color: 'var(--fg-2)' }}>
              <i style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, background: SHARE_COLORS[i], marginRight: 7 }} />
              {x.reason}
            </span>
            <b style={{ fontVariantNumeric: 'tabular-nums' }}>{pct(x.value, total, 0)}</b>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ================= 1 · OUTCOME ================= */
export function Outcome({ go }) {
  const m = useM();
  const fx = useFx();
  const r = D.rejectionByReason.rows;
  return (
    <div className="page">
      <Story stage={S.outcome}>
        We lost <em>18.6M</em> to rejections in August, and <em>40%</em> of it came with no reason from the payer.
      </Story>
      <div className="kpis">
        <Kpi c={C.outcome} label="Rejection value" per="Aug 2026" value={D.rejectionTotal.toFixed(2)} unit="M SAR" sub="Across 6 reason groups" />
        <Kpi c={C.warn} label="Sent with no reason" per="Aug 2026" value="7.49" unit="M SAR" sub={m('NCCI 6.02M · Med Gulf 1.43M')} act="Escalate to 2 payers" flag={{ kind: 'gap', text: `${pct(7.49, D.rejectionTotal)} unexplained` }} />
        <Kpi c={C.warn} label="Target / baseline" value="Not set" sub="Variance needs an approved target" flag={{ kind: 'gap', text: 'D1 gap · owner needed' }} />
        <Kpi c={C.outcome} label="Rejected + partial value" per="Nov 25 – Sep 26" value={D.valueByPayerTotal.toFixed(1)} unit="M SAR" sub="5 payers with recorded amounts" />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1.35fr 1fr 0.78fr' }}>
        <Panel title="Where the rejection value sits" per="Aug 2026 · SAR M" strength="attr"
          desc="Rejection value by reason group. The striped bar is a diagnostic gap, not a cause.">
          <HBars
            c={C.outcome}
            valueFmt={(v) => v.toFixed(2)}
            rows={r.map((x) => ({
              name: x.reason, value: x.value, gap: x.gap,
              c: x.lost ? C.bad : C.outcome,
              sub: x.note || (x.claims ? `${fmt(x.claims)} claims${x.lost ? ' · lost' : ''}` : ''),
            }))}
          />
        </Panel>
        <Panel title="Rejected + partial value by payer" per="Cumulative · SAR M" strength="ctx"
          desc="TCS group, Arabian Shield, TUCI, Gulf Union and AXA record no claimed amount, so they are left out rather than shown as zero.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={D.valueByPayer.rows.map((x, i) => ({ ...x, payer: m(x.payer), color: PAYER_COLORS[i] }))} margin={{ top: 30, right: 18, left: -18, bottom: 0 }}>
              {BarDefs({ colors: PAYER_COLORS })}
              <CartesianGrid vertical={false} />
              <XAxis dataKey="payer" tickLine={false} axisLine={false} interval={0} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<Tip unit="M SAR" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
              <Bar dataKey="value" shape={makeBar3D(fx)} maxBarSize={56} animationDuration={1100}>
                <LabelList dataKey="value" position="top" offset={fx ? 18 : 6} formatter={(v) => v.toFixed(1)} className="recharts-text" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Insight c={C.outcome} next="Which decisions drive it" onNext={() => go('output')}>
          <p>The largest slice is not a rejection reason. It is <b>missing information</b>.</p>
          <p className="muted">{m('Before we can fix 7.49M we need NCCI and Med Gulf to say why. Missing documents is the biggest reason we control: 3.53M on 188 claims.')}</p>
          <p className="muted">No approved target exists yet, so this page shows value lost, not variance to target.</p>
          <ShareBar rows={r} />
        </Insight>
      </div>
    </div>
  );
}

/* ================= 2 · OUTPUT ================= */
const TONE = { good: C.good, warn: C.output, bad: C.bad, muted: C.muted };
export function Output({ go }) {
  const f = D.funnel;
  const data = f.rows.map((r) => ({ name: r.k, value: r.v, color: TONE[r.tone] }));
  data[4].color = C.grey;
  return (
    <div className="page">
      <Story stage={S.output}>
        In July, <em>57%</em> of decided claims were not fully approved, and most of those were cut rather than refused.
      </Story>
      <div className="kpis">
        <Kpi c={C.output} label="Claims submitted" per="Jul 2026" value={fmt(f.submitted)} sub="Statement month" />
        <Kpi c={C.output} label="Decided by payer" per="Jul 2026" value={fmt(D.decided)} sub={`${pct(D.decided, f.submitted)} of submitted`} />
        <Kpi c={C.bad} label="Not fully approved" per="Jul 2026" value={fmt(D.notFullyApproved)} sub={`${pct(D.notFullyApproved, D.decided)} of decided`} flag={{ kind: 'bad', text: '5,468 partial · 2,336 rejected' }} />
        <Kpi c={C.good} label="Recovered by the team" per="Jul 2026" value={fmt(D.recovery.byTeam)} sub={`Plus ${fmt(D.recovery.byPayer)} re-decided by the payer`} act="Only team work counted" />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr 0.78fr' }}>
        <Panel title="Payer decisions" per="Jul 2026 · claims" strength="attr"
          desc="Five slices that close exactly to the submitted total.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%', alignItems: 'center', gap: 8 }}>
            <div style={{ height: '100%', position: 'relative' }}>
              <Donut3D data={data} top={fmt(f.submitted)} sub="submitted" inner="58%" outer="90%" tipUnit=" claims" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.map((d) => (
                <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 8, alignItems: 'center' }}>
                  <i style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ color: 'var(--fg-2)' }}>{d.name}</span>
                  <b style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(d.value)}</b>
                  <span style={{ color: 'var(--muted)', fontSize: '.85em', width: 44, textAlign: 'right' }}>{pct(d.value, f.submitted)}</span>
                </div>
              ))}
              <span className="flag good" style={{ alignSelf: 'flex-start', marginTop: 4, fontSize: '.78em', fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                ✓ Closes to {fmt(f.submitted)}
              </span>
            </div>
          </div>
        </Panel>
        <Panel title="Follow-up after a decision" per="Jul 2026 · claims" strength="attr"
          desc="Only claims the team worked count as team recovery. Payer re-decisions are shown apart.">
          <HBars
            c={C.process}
            valueFmt={fmt}
            rows={[
              { name: 'Resubmitted', value: D.recovery.resubmitted, c: C.input },
              { name: 'Recovered by team', value: D.recovery.byTeam, c: C.good, sub: 'Rejected → approved or partial' },
              { name: 'Re-decided by payer', value: D.recovery.byPayer, c: C.grey, sub: 'e.g. Bupa monthly batches' },
            ]}
          />
        </Panel>
        <Insight c={C.output} next="Is the team working them" onNext={() => go('process')}>
          <p><b>Partially approved</b> usually means the payer cut quantity or price on a line. It rarely means a line was refused.</p>
          <p className="muted">Counting payer re-decisions as team work would overstate the team by 75% (598 on top of 797).</p>
        </Insight>
      </div>
    </div>
  );
}

/* ================= 3 · PROCESS ================= */
export function Process({ go }) {
  const m = useM();
  const cm = D.communication;
  const worked = cm.total - cm.noComm;
  const donut = [
    { name: 'No Communication', value: cm.noComm, color: C.bad },
    { name: 'Communication raised', value: worked, color: C.process },
  ];
  return (
    <div className="page">
      <Story stage={S.process}>
        <em>Two in three</em> rejected or partial claims never get a Communication, and the old alert was hiding it.
      </Story>
      <div className="kpis">
        <Kpi c={C.bad} label="No Communication raised" per="Nov 25 – Sep 26" value={pct(cm.noComm, cm.total, 0)} sub={`${fmt(cm.noComm)} of ${fmt(cm.total)} claims`} act="The new daily alert flags them" />
        <Kpi c={C.process} label="Recovery rate" per="Cumulative" value="24.9%" sub="15,323 of ~61K ever rejected · ~20 days" />
        <Kpi c={C.process} label="Submission SLA met" per="Cumulative" value="48.3%" sub="From statement end date (2.6% if from visit date)" />
        <Kpi c={C.warn} label="Old alert vs reality" per={m('Arabian Shield · Jul')} value="2 → 329" sub="Claims with no Communication" flag={{ kind: 'bad', text: 'Fixed in the new alert' }} />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '0.9fr 1.25fr 1fr', gridTemplateRows: '1fr auto' }}>
        <Panel title="Was the claim worked?" per="Cumulative" strength="assoc" style={{ gridRow: '1 / 3' }}
          desc={m('Some claims are resent without a Communication (NCCI: 14.5%), so "worked" means Communication OR resend.')}>
          <div style={{ height: 'calc(100% - 26px)', position: 'relative' }}>
            <Donut3D data={donut} top="67%" topColor={C.bad} sub="no Communication" tipUnit=" claims" />
          </div>
          <div className="legend">
            <span><i style={{ background: C.bad }} />No Communication {fmt(cm.noComm)}</span>
            <span><i style={{ background: C.process }} />Raised {fmt(worked)}</span>
          </div>
        </Panel>
        <Panel title="One statement, two truths" per={m('TCS-Arabian Shield · Jul 2026')} strength="attr" style={{ gridRow: '1 / 3' }}
          desc="Source and Gold agree once the payer is taken from the Request row. The old alert used the wrong date window.">
          <HBars
            c={C.process}
            valueFmt={fmt}
            rows={D.caseStudy.rows.map((x) => ({
              name: x.short, title: x.k, value: x.v,
              c: x.alert ? C.bad : x.warn ? C.warn : C.process,
            }))}
          />
        </Panel>
        <Panel title="Days to act after a decision" per="Avg days" strength="assoc"
          desc={m('Days from a payer decision to the resend, against known human rework. NCCI resends in 1–2 days: is it automated?')}>
          <HBars c={C.process} unit=" d" rows={D.reworkDays.rows.map((x, i) => ({ name: x.short, value: x.v, c: i === 0 ? C.process : C.input }))} />
        </Panel>
        <Insight c={C.process} next="What constrains the team" onNext={() => go('input')} style={{ gridColumn: 3 }}>
          <p>The work is not reaching most rejections, and the tool meant to flag them did not.</p>
        </Insight>
      </div>
    </div>
  );
}

/* ================= 4 · INPUT ================= */
export function Input({ go }) {
  const m = useM();
  const k = D.inputKpis;
  return (
    <div className="page">
      <Story stage={S.input}>
        The biggest blockers sit <em>outside the team</em>: payers that send no reasons, no amounts, and late final decisions.
      </Story>
      <div className="kpis">
        <Kpi c={C.bad} label={m('Items with a reason · NCCI + Med Gulf')} per={k.reasons.period} value={fmt(k.reasons.withReason)} unit={`of ${fmt(k.reasons.items)}`} sub="Rejected items carrying any reason" />
        <Kpi c={C.input} label="Claims with no claimed amount" per="Rejected + partial" value={pct(k.noAmount.claims, k.noAmount.of)} sub={`${fmt(k.noAmount.claims)} of ${fmt(k.noAmount.of)} · not recorded at source`} />
        <Kpi c={C.input} label={m('NCCI final decision lands')} value="4–6" unit="weeks" sub="A month stays provisional until its batch" />
        <Kpi c={C.warn} label="Staffing & workload data" value="None" sub="No understaffing claim is made" flag={{ kind: 'gap', text: 'Diagnostic gap' }} />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1.55fr 1fr', gridTemplateRows: 'minmax(84px, 0.5fr) 1fr auto' }}>
        <Panel title="Constraint map by payer" per="Validation runs, Jun – Sep 2026" strength="ctx" style={{ gridRow: '1 / 4' }}
          desc="Where each upstream constraint hits. Red blocks diagnosis or recovery; amber is material; blue is minor or handled.">
          <table className="matrix">
            <thead>
              <tr>
                <th className="row" />
                {D.payersMatrix.map((p) => <th key={p}>{m(p)}</th>)}
              </tr>
            </thead>
            <tbody>
              {D.constraints.map((r) => (
                <tr key={r.name}>
                  <th className="row">{r.name}</th>
                  {r.cells.map(([lv, t], i) => (
                    <td key={i} className={lv === null ? 'lvn' : `lv${lv}`}>{m(t)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="legend">
            <span><i style={{ background: 'rgba(226,128,143,.6)' }} />Blocking</span>
            <span><i style={{ background: 'rgba(221,179,90,.6)' }} />Material</span>
            <span><i style={{ background: 'rgba(110,155,230,.6)' }} />Minor / handled</span>
            <span><i style={{ border: '1px dashed #7d86b8' }} />Unknown</span>
          </div>
        </Panel>
        <Panel title={m('NCCI final adjudication batches')} per="2026">
          <div className="tl">
            <div className="line" />
            {D.ncciBatches.map((d, i) => (
              <div className="pt" key={d} style={{ left: `${8 + (i * 84) / (D.ncciBatches.length - 1)}%` }}>
                <i />
                <span>{d.slice(5)}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Diagnostic gaps that need an owner" strength="ctx">
          <div className="gaplist">
            {D.gaps.map((g) => (
              <div key={g.k}>
                <b>{g.k}</b>
                <em>{g.owner}</em>
                <span title={m(g.v)}>{m(g.v)}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Insight c={C.input} next="What we do this week" onNext={() => go('action')}>
          <p>Most fixes here are agreements with payers and data, not more effort from the team.</p>
        </Insight>
      </div>
    </div>
  );
}

/* ================= 5 · ACTION ================= */
export function Action() {
  const m = useM();
  const valued = D.actions.filter((a) => a.v != null).sort((a, b) => b.v - a.v);
  return (
    <div className="page">
      <Story stage={S.action}>
        Six actions, each with a trigger, an owner and evidence. <em>Start with 188 claims worth 3.53M.</em>
      </Story>
      <div className="kpis">
        <Kpi c={C.action} label="Quick win · missing documents" per="Aug 2026" value="3.53" unit="M SAR" sub="188 claims · ~18.8K per claim" act="Fix 188 files this week" flag={{ kind: 'good', text: 'Inside our control' }} />
        <Kpi c={C.action} label="Closed, never sent to NPHIES" per="Nov 25 – Aug 26" value="6.74" unit="M SAR" sub={m('Bupa 4.35M · MOH 1.16M · NCCI 0.96M')} />
        <Kpi c={C.action} label={m('Med Gulf "already linked to batch"')} per="May – Sep 2026" value="0.85" unit="M SAR" sub="1,089 claims, none resent" />
        <Kpi c={C.bad} label="Lost for good · late submission" per="Aug 2026" value="0.54" unit="M SAR" sub="24 claims · prevent at source" />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1.85fr 1fr', gridTemplateRows: '1fr 1fr' }}>
        <Panel title="Action board" per="Owners are roles, to confirm" style={{ gridRow: '1 / 3' }}>
          <table className="board">
            <colgroup>
              <col style={{ width: '25%' }} /><col style={{ width: '21%' }} /><col style={{ width: '13%' }} />
              <col style={{ width: '15%' }} /><col style={{ width: '16%' }} /><col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr><th>Action</th><th>Trigger</th><th>Owner</th><th>Value at stake</th><th>Evidence</th><th>Status</th></tr>
            </thead>
            <tbody>
              {D.actions.map((a) => (
                <tr key={a.act}>
                  <td className="act">{m(a.act)}</td>
                  <td>{m(a.trigger)}</td>
                  <td>{a.owner}</td>
                  <td>{m(a.value)}<span className="per">{a.period}</span></td>
                  <td>{a.evidence}</td>
                  <td><span className={`status ${a.status === 'Proposed' ? 'Proposed' : 'progress'}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Value at stake" per="SAR M · periods differ, not summed">
          <HBars
            c={C.action}
            valueFmt={(v) => v.toFixed(2)}
            unit="M"
            rows={valued.map((a) => ({ name: m(a.short), value: a.v, c: a.status === 'Proposed' && a.v === 0.54 ? C.bad : C.action }))}
          />
        </Panel>
        <Panel title="How each action closes" desc="Execution and outcome evidence are kept apart. Value is Pending until signed off.">
          <div className="loop">
            <div className="n"><b>Trigger</b><span>Rule fires</span></div>
            <div className="n"><b>Decision</b><span>Decision owner</span></div>
            <div className="n"><b>Action</b><span>Owner + SLA</span></div>
            <div className="n ev"><b>Done?</b><span>Execution evidence</span></div>
            <div className="n ev"><b>Moved?</b><span>Outcome evidence</span></div>
            <div className="n val"><b>Value</b><span>Signed off</span></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ================= 0 · EXECUTIVE BRIEF ================= */
const REASON_COLORS = ['#ddb35a', '#52b8a6', '#6e9be6', '#9a8ceb', '#c48fcf', '#e2808f'];
export function Brief({ go }) {
  const m = useM();
  const fx = useFx();
  const bars = D.rejectionByReason.rows.map((x, i) => ({ name: x.short, full: x.reason, value: x.value, color: REASON_COLORS[i] }));
  return (
    <div className="page">
      <Story stage={D.BRIEF}>
        In August <em>18.6M</em> was rejected. <em>3.53M</em> can be worked this week, and <em>7.49M</em> needs a conversation with two payers.
      </Story>
      <div className="kpis">
        <Kpi c={C.outcome} label="Rejected in one month" per="Aug 2026" value="18.59" unit="M SAR" sub="6 reason groups" act="Approve a monthly target" />
        <Kpi c={C.good} label="Quick win" per="Aug 2026" value="3.53" unit="M SAR" sub="Missing documents · 188 claims · ~18.8K each" act="Fix 188 files this week" />
        <Kpi c={C.input} label="Closed, never sent to NPHIES" per="Nov 25 – Aug 26" value="6.74" unit="M SAR" sub={m('Bupa 4.35M · MOH 1.16M · NCCI 0.96M')} act="Submit the backlog" />
        <Kpi c={C.warn} label="Rejected with no reason" per="Aug 2026" value="7.49" unit="M SAR" sub={m('NCCI 6.02M · Med Gulf 1.43M')} act="Escalate to 2 payers" />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1.05fr 1.2fr 0.95fr' }}>
        <Panel title="Health of the claims cycle" per="No approved targets yet"
          desc="Rings show the current level. Periods differ and are labelled on each ring.">
          <div className="gauges">
            {D.gaugesJul.map((g) => <Gauge key={g.label} {...g} />)}
          </div>
        </Panel>
        <Panel title="Where August's 18.6M went" per="Aug 2026 · SAR M" strength="attr"
          desc="Rejection value by reason group. Amber has no reason from the payer.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bars} margin={{ top: 30, right: 20, left: -18, bottom: 0 }}>
              {BarDefs({ colors: REASON_COLORS })}
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<Tip unit="M SAR" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
              <Bar dataKey="value" shape={makeBar3D(fx)} maxBarSize={60} animationDuration={1200}>
                <LabelList dataKey="value" position="top" offset={fx ? 18 : 6} formatter={(v) => v.toFixed(2)} className="recharts-text" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Three decisions for leadership">
          <div className="decisions">
            {D.ceoDecisions.map((d, i) => (
              <div className="dec" key={d.t}>
                <span className="no">{i + 1}</span>
                <b>{m(d.t)}</b>
                <span>{m(d.d)}</span>
              </div>
            ))}
            <button className="navbtn" style={{ '--c': C.outcome, marginTop: 4 }} onClick={() => go('outcome')}>See the full story →</button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
