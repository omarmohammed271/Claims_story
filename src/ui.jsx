import React, { createContext, useContext, useEffect, useRef, useState, useId } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { maskText } from './data.js';

export const MaskCtx = createContext(false);
export const FxCtx = createContext(false); // 3D depth is off; kept only as a switch for later
export function useM() {
  const on = useContext(MaskCtx);
  return (t) => maskText(t, on);
}
export const useFx = () => useContext(FxCtx);

export const fmt = (n) => n.toLocaleString('en-US');
export const pct = (a, b, d = 1) => ((a / b) * 100).toFixed(d) + '%';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- colour helpers ---------- */
export function shade(hex, amt) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  r = f(r); g = f(g); b = f(b);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

/* ---------- animated numbers ---------- */
function parseNum(v) {
  if (typeof v === 'number') return { n: v, dec: Number.isInteger(v) ? 0 : 2, comma: true, suffix: '' };
  if (typeof v !== 'string') return null;
  const m = v.match(/^(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(%)?$/);
  if (!m) return null;
  return { n: parseFloat((m[1] + (m[2] || '')).replace(/,/g, '')), dec: m[2] ? m[2].length - 1 : 0, comma: m[1].includes(','), suffix: m[3] || '' };
}
function useCount(target, ms = 1100) {
  const fx = useFx();
  const [v, setV] = useState(reduced() ? target : 0);
  useEffect(() => {
    if (reduced()) { setV(target); return; }
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, fx]);
  return v;
}
export function CountUp({ value, format }) {
  const p = parseNum(value);
  const v = useCount(p ? p.n : 0);
  if (!p) return <>{value}</>;
  if (format) return <>{format(v)}</>;
  const s = v.toLocaleString('en-US', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec, useGrouping: p.comma });
  return <>{s}{p.suffix}</>;
}

/* ---------- story headline ---------- */
export function Story({ stage, children, strength }) {
  return (
    <div className="story" style={{ '--c': stage.color }}>
      <span className="badge">{stage.code} · {stage.name}</span>
      <h2>{children}</h2>
      {strength && <span className="cap">{strength}</span>}
    </div>
  );
}

export function Strength({ kind }) {
  const map = { attr: 'Attributive', assoc: 'Associative', ctx: 'Contextual' };
  return <span className={`strength ${kind}`} title="Diagnostic strength">{map[kind]}</span>;
}

/* ---------- KPI card with 3D tilt ---------- */
function useTilt() {
  const ref = useRef(null);
  const fx = useFx();
  const onMove = (e) => {
    if (!fx || reduced() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
    ref.current.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
    ref.current.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  };
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

export function Kpi({ c, label, per, value, unit, sub, flag, act }) {
  const tilt = useTilt();
  return (
    <div className="kpi" style={{ '--c': c }} {...tilt}>
      <div className="lbl"><span>{label}</span>{per && <span>{per}</span>}</div>
      <div className="val"><CountUp value={value} />{unit && <small>{unit}</small>}</div>
      {sub && <div className="sub">{sub}</div>}
      {act && <div className="act">→ {act}</div>}
      {flag && <span className={`flag ${flag.kind}`}>{flag.text}</span>}
    </div>
  );
}

export function Panel({ title, per, desc, strength, children, style }) {
  return (
    <section className="panel" style={style}>
      <h3>
        <span>{title} {strength && <Strength kind={strength} />}</span>
        {per && <span className="per">{per}</span>}
      </h3>
      {desc && <p className="desc">{desc}</p>}
      <div className="body">{children}</div>
    </section>
  );
}

export function Insight({ c, label = 'So what', children, next, onNext, style }) {
  return (
    <section className="insight" style={{ '--c': c, ...style }}>
      <span className="k">{label}</span>
      {children}
      {next && (
        <button className="navbtn" onClick={onNext}>
          {next} →
        </button>
      )}
    </section>
  );
}

/* ---------- glossy horizontal bars ---------- */
export function HBars({ rows, max, c, unit = '', valueFmt = (v) => v }) {
  const m = useM();
  const top = max ?? Math.max(...rows.map((r) => r.value));
  return (
    <div className="hbars">
      {rows.map((r, i) => (
        <div className="hbar" key={r.name} style={{ '--c': r.c || c, '--i': i }} title={m(r.title || r.name)}>
          <span className="name">{m(r.name)}</span>
          <div className="track">
            <div className={`fill ${r.gap ? 'gapfill' : ''}`} style={{ width: `${Math.max(1.5, (r.value / top) * 100)}%` }} />
          </div>
          <span className="num">
            <CountUp value={r.value} format={(v) => valueFmt(r.value % 1 === 0 ? Math.round(v) : v)} />{unit}
            {r.sub && <small>{m(r.sub)}</small>}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- extruded 3D bar (scale-true: front face height = value) ---------- */
export function makeBar3D(fx) {
  return function Bar3D(props) {
    const { x, y, width, height } = props;
    const color = props.color || props.payload?.color || '#a855f7';
    if (!height || height <= 0) return null;
    if (!fx) return <rect x={x} y={y} width={width} height={height} rx={6} fill={color} />;
    const d = Math.min(14, width * 0.28);
    return (
      <g>
        <polygon points={`${x + width},${y} ${x + width + d},${y - d} ${x + width + d},${y + height - d} ${x + width},${y + height}`} fill={shade(color, -0.5)} />
        <polygon points={`${x},${y} ${x + d},${y - d} ${x + width + d},${y - d} ${x + width},${y}`} fill={shade(color, 0.35)} />
        <rect x={x} y={y} width={width} height={height} fill={`url(#front-${color.slice(1)})`} />
      </g>
    );
  };
}
export function BarDefs({ colors }) {
  return (
    <defs>
      {colors.map((c) => (
        <linearGradient key={c} id={`front-${c.slice(1)}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade(c, -0.25)} />
          <stop offset="45%" stopColor={c} />
          <stop offset="100%" stopColor={shade(c, -0.15)} />
        </linearGradient>
      ))}
    </defs>
  );
}

/* ---------- 3D donut (tilted, extruded; slice angles unchanged) ---------- */
export function Donut3D({ data, top, sub, topColor, inner = '60%', outer = '88%', tipUnit = '' }) {
  const fx = useFx();
  const layers = fx ? [10, 8, 6, 4, 2] : [];
  return (
    <div className={`d3 ${fx ? 'on' : ''}`}>
      <div className="d3tilt">
        {layers.map((o) => (
          <div className="d3layer" key={o} style={{ transform: `translateY(${o}px)` }} aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={inner} outerRadius={outer} paddingAngle={2} stroke="none"
                  startAngle={90} endAngle={-270} isAnimationActive={false}>
                  {data.map((d) => <Cell key={d.name} fill={shade(d.color, -0.55)} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
        <div className="d3layer top">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((d, i) => (
                  <linearGradient key={i} id={`dg-${i}-${d.color.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={shade(d.color, 0.25)} />
                    <stop offset="100%" stopColor={d.color} />
                  </linearGradient>
                ))}
              </defs>
              <Pie data={data} dataKey="value" innerRadius={inner} outerRadius={outer} paddingAngle={2} stroke="none"
                startAngle={90} endAngle={-270} animationDuration={1100}>
                {data.map((d, i) => <Cell key={d.name} fill={fx ? `url(#dg-${i}-${d.color.slice(1)})` : d.color} />)}
              </Pie>
              <Tooltip content={<Tip unit={tipUnit} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {fx && <div className="d3shadow" aria-hidden="true" />}
      <div className="d3center">
        <div>
          <div className="d3big" style={{ color: topColor }}><CountUp value={top} /></div>
          <div className="d3sub">{sub}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- radial gauge ---------- */
export function Gauge({ value, label, per, color, note }) {
  const fx = useFx();
  const id = useId().replace(/:/g, '');
  const R = 46, L = 2 * Math.PI * R;
  const [p, setP] = useState(reduced() ? value : 0);
  useEffect(() => {
    if (reduced()) { setP(value); return; }
    const t = setTimeout(() => setP(value), 60);
    return () => clearTimeout(t);
  }, [value, fx]);
  return (
    <div className={`gauge ${fx ? 'on' : ''}`} style={{ '--c': color }}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`${label}: ${value}%`}>
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shade(color, 0.35)} />
            <stop offset="100%" stopColor={shade(color, -0.2)} />
          </linearGradient>
          <radialGradient id={`r-${id}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill={`url(#r-${id})`} />
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="11" />
        <circle cx="60" cy="60" r={R} fill="none" stroke={`url(#g-${id})`} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={L} strokeDashoffset={L * (1 - p / 100)} transform="rotate(-90 60 60)" className="arc" />
      </svg>
      <div className="gv">
        <b><CountUp value={`${value}%`} /></b>
        <span>{label}</span>
        <em>{per}{note ? ` · ${note}` : ''}</em>
      </div>
    </div>
  );
}

export function Tip({ active, payload, label, unit = '' }) {
  const m = useM();
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="tt">
      <b>{m(label ?? p.name)}</b>: {typeof p.value === 'number' ? p.value.toLocaleString('en-US') : p.value}{unit}
    </div>
  );
}
