// @refresh reset
import { useEffect, useRef } from "react";
import "./tfp.css";
import "./tfp-integration.css";

declare global {
  interface Window {
    TimeToProgress?: { init: (root: HTMLElement) => () => void; initAll: () => void };
  }
}

let runtimeReady: Promise<void> | undefined;

function loadRuntime() {
  if (window.TimeToProgress) return Promise.resolve();
  if (!runtimeReady) {
    runtimeReady = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/time-to-progress/tfp.js?v=4";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        runtimeReady = undefined;
        script.remove();
        reject(new Error("TimeToProgress failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return runtimeReady;
}

export function TimeToProgress() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;
    // Defer initialization so the discarded Strict Mode effect does not mount it.
    loadRuntime().then(() => {
      if (!cancelled && rootRef.current) {
        destroy = window.TimeToProgress?.init(rootRef.current);
      }
    }).catch(console.error);
    return () => { cancelled = true; destroy?.(); };
  }, []);

  // Noto Sans Hebrew 500/700 is already loaded by KnowledgeTakesShape on this page.
  return (
<section ref={rootRef} className="tfp" dir="rtl" lang="he" aria-label="מזמן שמתפזר לעבודה שמתקדמת">
  <div className="tfp-stage is-a is-b is-c is-d">
    <svg className="tfp-lines" aria-hidden="true">
      <path className="tfp-thread" d=""/>
      <path className="tfp-progress" d=""/>
    </svg>

    <div className="tfp-head">
      <h3 id="time-heading" className="tfp-quote"><span>״אבל אין לי זמן עכשיו</span> <span>לשבת ולבנות את כל זה״</span></h3>
    </div>

    <ul className="tfp-chaos" aria-hidden="true" role="list">
      <li className="tfp-chip"><span>עשרות סרטוני YouTube</span></li>
      <li className="tfp-chip"><span>חיפוש אחרי הכלי הנכון</span></li>
      <li className="tfp-chip"><span>ניסוי של עוד עשרה פרומפטים</span></li>
      <li className="tfp-chip"><span>התכתבויות עם ספקים</span></li>
      <li className="tfp-chip"><span>לבנות משהו, לגלות שהוא לא נכון ולהתחיל מחדש</span></li>
    </ul>

    <div className="tfp-diagram">
      <div className="tfp-knot"><span className="tfp-knot-cap">זמן שמתפזר</span></div>
      <ol className="tfp-steps">
        <li className="tfp-step is-on"><span className="tfp-node" aria-hidden="true">1</span><span className="tfp-label">מחדדים רעיון</span></li>
        <li className="tfp-step is-on"><span className="tfp-node" aria-hidden="true">2</span><span className="tfp-label">בונים הצעה</span></li>
        <li className="tfp-step is-on"><span className="tfp-node" aria-hidden="true">3</span><span className="tfp-label">יוצרים בפועל</span></li>
      </ol>
      <span className="tfp-end" aria-hidden="true"></span>
    </div>

    <p className="tfp-say">
      <span className="tfp-say-1">המטרה של הקורס היא לא לעשות עבורכם את כל העבודה.</span>
      <span className="tfp-say-2">אלא לעזור לכם לעבור מהכנות למכירות, ולבנות משם את הצעד הבא בעסק.</span>
    </p>


  </div>
</section>
  );
}
