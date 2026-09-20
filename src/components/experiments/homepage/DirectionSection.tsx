import { Link } from 'react-router-dom';

export default function DirectionSection() {
  return <section className="home-direction home-section" dir="rtl" aria-labelledby="direction-title">
    <div className="home-container home-direction__layout">
      <h2 id="direction-title">להצליח לעבוד עם AI<br /><span>מבלי ללכת לאיבוד</span></h2>
      <div className="home-direction__actions">
        <a className="home-button home-button--gold" href="#courses" onClick={(event) => {
          if (!document.getElementById('courses')) { event.preventDefault(); window.location.assign('/products'); }
        }}>התחילו כאן</a>
        <Link className="home-button home-direction__organization" to="/corporate-workshops">ארגונים? אתם פה</Link>
      </div>
    </div>
  </section>;
}
