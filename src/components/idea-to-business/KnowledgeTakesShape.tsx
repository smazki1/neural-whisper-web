// @refresh reset
import { useEffect, useRef, type CSSProperties } from "react";
import { Helmet } from "react-helmet-async";
import "./kts.css";
import "./kts-integration.css";

declare global {
  interface Window {
    KnowledgeTakesShape?: { init: (root: HTMLElement) => () => void; initAll: () => void };
  }
}

let runtimeReady: Promise<void> | undefined;

function loadRuntime() {
  if (window.KnowledgeTakesShape) return Promise.resolve();
  if (!runtimeReady) {
    runtimeReady = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/knowledge-takes-shape/kts.js?v=3";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => { runtimeReady = undefined; script.remove(); reject(new Error("KnowledgeTakesShape failed to load")); };
      document.head.appendChild(script);
    });
  }
  return runtimeReady;
}

export function KnowledgeTakesShape() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;
    // Defer even an already-loaded runtime so Strict Mode's discarded effect
    // never initializes the same DOM twice.
    loadRuntime().then(() => {
      if (!cancelled && rootRef.current) {
        destroy = window.KnowledgeTakesShape?.init(rootRef.current);
      }
    }).catch(console.error);
    return () => { cancelled = true; destroy?.(); };
  }, []);

  return <>
    <Helmet><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@500;700&display=swap" rel="stylesheet" /></Helmet>
<section ref={rootRef} className="kts" dir="rtl" lang="he" aria-label="הידע שלכם מקבל צורה">
  <div className="kts-stage is-raw is-threads is-fade is-gather is-join is-form is-final" data-opt="a">
    <div className="kts-glow" aria-hidden="true"></div>
    <svg className="kts-threads" aria-hidden="true" preserveAspectRatio="none"><path className="kts-thread" pathLength="1" d=""/></svg>
    <div className="kts-card" aria-hidden="true"></div>


    <div className="kts-piece kts-p1">
      <div className="kts-float">
        <p className="kts-note-text">שאלה שהלקוחות תמיד שואלים</p>
        <div className="kts-choice" role="group" aria-label="צורת התוצאה">
          <span className="kts-ind" aria-hidden="true"></span>
          <button className="kts-opt" type="button" data-opt="a" aria-pressed="true" aria-label="תוצאה רציפה">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
          <button className="kts-opt" type="button" data-opt="b" aria-pressed="false" aria-label="תוצאה בשלבים">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4.1 2.7"/></svg>
          </button>
        </div>
      </div>
    </div>


    <div className="kts-piece kts-p2">
      <div className="kts-float">
        <p className="kts-note-text">דרך שפיתחתי עם השנים</p>
        <div className="kts-slider">
          <span className="kts-track" aria-hidden="true"></span>
          <span className="kts-fill" aria-hidden="true"></span>
          <span className="kts-tick" style={{ "--t": "0" } as CSSProperties} aria-hidden="true"></span>
          <span className="kts-tick" style={{ "--t": ".5" } as CSSProperties} aria-hidden="true"></span>
          <span className="kts-tick" style={{ "--t": "1" } as CSSProperties} aria-hidden="true"></span>
          <span className="kts-knob" aria-hidden="true"></span>
          <input className="kts-range" type="range" min="0" max="100" defaultValue="72" dir="rtl" aria-label="כוונון" />
        </div>
      </div>
    </div>


    <div className="kts-piece kts-p3">
      <div className="kts-float">
        <p className="kts-note-text">רעיון שעוד לא הוצאתי לפועל</p>
        <div className="kts-result" role="img" aria-label="תוצאה: 72">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="kts-ring-track" cx="60" cy="60" r="50"/>
            <circle className="kts-ring-arc" cx="60" cy="60" r="50" transform="rotate(-90 60 60)" strokeDasharray="226.19 314.16"/>
            <g className="kts-seg"></g>
          </svg>
          <span className="kts-num" aria-hidden="true">72</span>
        </div>
      </div>
    </div>

    <div className="kts-frame" aria-hidden="true"></div>

    <p className="kts-say">
      <span className="kts-line">הידע שלכם.</span>
      <span className="kts-line"><span className="kts-hl">מוצר</span> שאחרים יכולים להשתמש בו.</span>
    </p>

    <button className="kts-replay" type="button">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8a4.8 4.8 0 1 0 1.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M4.6 1.8v2.9H1.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      צפייה חוזרת
    </button>
  </div>
</section>
  </>;
}
