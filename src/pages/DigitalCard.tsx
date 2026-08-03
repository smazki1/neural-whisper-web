import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, MessageCircle, CalendarCheck, Globe, Building2 } from 'lucide-react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { useAnalytics } from '@/hooks/useAnalytics';
import aviPortraitAsset from '@/assets/avi-fried-new.jpg.asset.json';

const aviPortrait = aviPortraitAsset.url;

const EMAIL = 'avi@ai-master.co.il';
const PHONE_DISPLAY = '052-777-2807';
const PHONE_INTL = '+972527772807';
const WHATSAPP_URL =
  'https://wa.me/972527772807?text=' +
  encodeURIComponent('היי אבי, נפגשנו ורציתי לדבר איתך בנושא:');

const buildVCard = () => {
  const site = window.location.origin;
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:פריד;אבי;;;',
    'FN:אבי פריד',
    'ORG:AI Master',
    'TITLE:מרצה ויועץ לבינה מלאכותית מעשית',
    `TEL;TYPE=CELL:${PHONE_INTL}`,
    `EMAIL;TYPE=INTERNET:${EMAIL}`,
    `URL:${site}`,
    'END:VCARD',
  ].join('\r\n');
};

const DigitalCard = () => {
  const { trackCTAClick, trackDownload } = useAnalytics();

  const handleSaveContact = () => {
    trackDownload('avi-frid.vcf', 'vcard');
    const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'avi-frid.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div dir="rtl" className="avi-card font-heebo">
      <SEOHead
        title="אבי פריד – כרטיס ביקור דיגיטלי | AI Master"
        description="אבי פריד, מרצה ויועץ לבינה מלאכותית מעשית. שמירת פרטי קשר, שליחת הודעה בוואטסאפ, הזמנת הרצאה או סדנה לארגון, או מעבר לאתר."
        noIndex
      />

      {/* Ambient depth layers */}
      <div className="avi-card__aura avi-card__aura--one" aria-hidden="true" />
      <div className="avi-card__aura avi-card__aura--two" aria-hidden="true" />
      <div className="avi-card__aura avi-card__aura--three" aria-hidden="true" />
      <div className="avi-card__grid" aria-hidden="true" />

      <main id="main-content" className="avi-card__inner">
        <header className="text-center">
          <p className="avi-card__kicker">AI&nbsp;MASTER</p>

          <div className="avi-card__portrait">
            <img
              src={aviPortrait}
              alt="אבי פריד, מרצה ויועץ לבינה מלאכותית"
              loading="eager"
            />
          </div>

          <h1 className="avi-card__title">אבי פריד</h1>

          <div className="avi-card__rule" aria-hidden="true" />

          <p className="avi-card__role">מרצה ויועץ לבינה מלאכותית מעשית</p>
          <p className="avi-card__lede">
            עוזר לאנשים ולארגונים להפוך את ה-AI לכלי עבודה פשוט, שימושי ומעשי.
          </p>
        </header>

        <nav aria-label="פעולות מרכזיות" className="avi-card__actions">
          <button
            type="button"
            onClick={handleSaveContact}
            className="avi-action avi-action--primary"
          >
            <span className="avi-action__icon">
              <UserPlus size={22} strokeWidth={1.9} />
            </span>
            <span className="avi-action__text">
              <span className="avi-action__label">שמירת אבי באנשי הקשר</span>
              <span className="avi-action__hint">הורדת כרטיס איש קשר</span>
            </span>
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('WhatsApp', 'digital-card')}
            className="avi-action"
          >
            <span className="avi-action__icon">
              <MessageCircle size={22} strokeWidth={1.9} />
            </span>
            <span className="avi-action__text">
              <span className="avi-action__label">שליחת הודעה ב-WhatsApp</span>
              <span className="avi-action__hint">{PHONE_DISPLAY}</span>
            </span>
          </a>

          <Link
            to="/contact?source=digital-card"
            onClick={() => trackCTAClick('הזמנת הרצאה או סדנה', 'digital-card')}
            className="avi-action"
          >
            <span className="avi-action__icon">
              <CalendarCheck size={22} strokeWidth={1.9} />
            </span>
            <span className="avi-action__text">
              <span className="avi-action__label">הזמנת הרצאה או סדנה</span>
              <span className="avi-action__hint">מעבר לטופס יצירת קשר</span>
            </span>
          </Link>

          <Link
            to="/"
            onClick={() => trackCTAClick('מעבר לאתר AI Master', 'digital-card')}
            className="avi-action"
          >
            <span className="avi-action__icon">
              <Globe size={22} strokeWidth={1.9} />
            </span>
            <span className="avi-action__text">
              <span className="avi-action__label">מעבר לאתר AI Master</span>
              <span className="avi-action__hint">ai-master.co.il</span>
            </span>
          </Link>
        </nav>

        <footer className="avi-card__footer">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </footer>
      </main>
    </div>
  );
};

export default DigitalCard;
