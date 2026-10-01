import React, { useCallback, useEffect, useState } from 'react';
import { PRODUCT, STAGES, BRIEF } from './data.js';
import { MaskCtx, FxCtx } from './ui.jsx';
import { Brief, Outcome, Output, Process, Input, Action } from './pages.jsx';
import Chat from './Chat.jsx';

const NAV = [BRIEF, ...STAGES];
const PAGES = [Brief, Outcome, Output, Process, Input, Action];

function readHash() {
  const h = typeof location !== 'undefined' ? location.hash.replace('#', '') : '';
  const i = NAV.findIndex((s) => s.key === h);
  return i >= 0 ? i : 0;
}

export default function App() {
  const [idx, setIdx] = useState(readHash);
  const [masked, setMasked] = useState(false);
  const [chat, setChat] = useState(false);
  const [intro, setIntro] = useState(() => !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches));
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    if (!intro) { const t = setTimeout(() => setBoot(false), 1600); return () => clearTimeout(t); }
    const t = setTimeout(() => setIntro(false), 2000);
    return () => clearTimeout(t);
  }, [intro]);

  const go = useCallback((to) => {
    const i = typeof to === 'number' ? to : NAV.findIndex((s) => s.key === to);
    if (i < 0 || i >= NAV.length) return;
    setIdx(i);
    try { history.replaceState(null, '', '#' + NAV[i].key); } catch { /* sandboxed */ }
  }, []);

  useEffect(() => {
    const onHash = () => setIdx(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') go(Math.min(idx + 1, NAV.length - 1));
      if (e.key === 'ArrowLeft') go(Math.max(idx - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, go]);

  const Page = PAGES[idx];

  return (
    <MaskCtx.Provider value={masked}>
      <FxCtx.Provider value={false}>
      <div className={`app ${boot && !intro ? 'boot' : ''}`}>
        {intro && (
          <div className="intro" onClick={() => setIntro(false)} role="presentation">
            <div className="in">
              <div className="logo" aria-hidden="true">B</div>
              <h1>{PRODUCT.title}</h1>
              <p>Basirah · {PRODUCT.id} · From outcome to action</p>
              <div className="bar"><i /></div>
            </div>
          </div>
        )}
        <header className="hdr">
          <div className="brand">
            <div className="mark" aria-hidden="true">B</div>
            <div>
              <small>Basirah · {PRODUCT.id}</small>
              <h1>{PRODUCT.title}</h1>
            </div>
          </div>
          <div className="question"><b>Decision question:</b> {PRODUCT.question}</div>
          <div className="meta">
            <span className="chip draft"><span className="dot" />Certification: {PRODUCT.certification}</span>
            <span className="chip state"><span className="dot" />{PRODUCT.state}</span>
            <span className="chip" title={PRODUCT.source}>Owner: {PRODUCT.owner}</span>
            <button className="chip toggle" aria-pressed={masked} onClick={() => setMasked((v) => !v)}>
              {masked ? '◉' : '○'} Mask payers
            </button>
            <button className="fab" onClick={() => setChat((v) => !v)} aria-expanded={chat} aria-label="Open the Basirah assistant">
              <span className="spark" aria-hidden="true">✦</span><span>Ask Basirah</span>
            </button>
          </div>
        </header>

        <nav className="stepper" aria-label="Diagnostic story">
          {NAV.map((s, i) => (
            <button key={s.key} className={`step ${i === 0 ? 'brief' : ''}`} style={{ '--c': s.color, '--n': i }} aria-current={i === idx ? 'page' : undefined} onClick={() => go(i)}>
              <span className="code">{s.code}</span>
              <span className="nm">{i === 0 ? s.name : `${i}. ${s.name}`}</span>
              <span className="q">{s.q}</span>
              {i > 0 && i < NAV.length - 1 && <span className="arrow" aria-hidden="true">▶</span>}
            </button>
          ))}
        </nav>

        <main style={{ minHeight: 0, display: 'grid' }}>
          {!intro && <Page key={idx} go={go} />}
        </main>

        <footer className="ftr">
          <span><b>Powered by BI Team</b> · Source: {PRODUCT.source} · Data reliable from {PRODUCT.reliableFrom} · Every figure shows its own period</span>
          <span>Prototype · <span className="kbd">←</span> <span className="kbd">→</span> to move through the story</span>
        </footer>

        <Chat open={chat} setOpen={setChat} go={go} />
      </div>
      </FxCtx.Provider>
    </MaskCtx.Provider>
  );
}
