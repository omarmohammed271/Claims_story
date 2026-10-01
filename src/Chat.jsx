import React, { useEffect, useRef, useState } from 'react';
import { SUGGESTIONS, answer } from './kb.js';
import { useM } from './ui.jsx';

const HELLO = {
  role: 'bot',
  text: 'Hi, I am the Basirah assistant. Ask me about the claims story: what we lose, why, and what to do first.',
  confidence: null,
};

export default function Chat({ open, setOpen, go }) {
  const m = useM();
  const [msgs, setMsgs] = useState([HELLO]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const box = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [msgs, busy]);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  function ask(text) {
    const t = text.trim();
    if (!t || busy) return;
    setMsgs((x) => [...x, { role: 'user', text: t }]);
    setQ('');
    setBusy(true);
    const a = answer(t);
    setTimeout(() => {
      setMsgs((x) => [...x, { role: 'bot', text: a.answer, confidence: a.confidence, source: a.source, page: a.page, fb: null }]);
      setBusy(false);
      if (a.page) go(a.page);
    }, 650);
  }

  function rate(i, v) {
    setMsgs((x) => x.map((mm, j) => (j === i ? { ...mm, fb: mm.fb === v ? null : v } : mm)));
  }

  if (!open) return null;

  return (
    <div className="chat" role="dialog" aria-label="Basirah assistant">
      <div className="in">
        <header>
          <span aria-hidden="true" style={{ fontSize: 18 }}>✦</span>
          <div>
            <b>Basirah Assistant</b> <span className="ai">AI</span>
            <div className="demo">Demo · scripted answers from verified findings</div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close assistant">✕</button>
        </header>
        <div className="msgs" ref={box} aria-live="polite">
          {msgs.map((mm, i) => (
            <div key={i} className={`msg ${mm.role}`}>
              {m(mm.text)}
              {mm.role === 'bot' && mm.confidence && (
                <div className="foot">
                  <span className={`conf ${mm.confidence}`}>{mm.confidence}</span>
                  <span>{mm.source}</span>
                  <span className="fb">
                    <button aria-label="Helpful" aria-pressed={mm.fb === 'up'} onClick={() => rate(i, 'up')}>👍</button>
                    <button aria-label="Not helpful" aria-pressed={mm.fb === 'down'} onClick={() => rate(i, 'down')}>👎</button>
                  </span>
                </div>
              )}
            </div>
          ))}
          {busy && (
            <div className="msg bot"><span className="typing"><i /><i /><i /></span></div>
          )}
        </div>
        <div className="suggs">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="sugg" onClick={() => ask(s)}>{s}</button>
          ))}
        </div>
        <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
          <input id="chat-q" ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about the claims story…" aria-label="Your question" />
          <button type="submit">Send</button>
        </form>
        <div className="disclaim">Model: scripted demo v0.1 · answers link to the page they come from · feedback goes to the model register in production.</div>
      </div>
    </div>
  );
}
