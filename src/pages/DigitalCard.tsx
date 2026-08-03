import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, CalendarCheck, Globe, Building2 } from 'lucide-react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { useAnalytics } from '@/hooks/useAnalytics';
import aviPortraitAsset from '@/assets/avi-fried-new.jpg.asset.json';

const aviPortrait = aviPortraitAsset.url;

const WHATSAPP_URL =
  'https://wa.me/972527772807?text=' +
  encodeURIComponent('היי אבי, נפגשנו ורציתי לדבר איתך בנושא:');

const DigitalCard = () => {
  const { trackCTAClick } = useAnalytics();

  return (
    <div dir="rtl" className="avi-card font-heebo">
      <SEOHead
        title="אבי פריד – כרטיס ביקור דיגיטלי | AI Master"
        description="אבי פריד, מרצה ויועץ לבינה מלאכותית מעשית. שליחת הודעה בוואטסאפ, הזמנת הרצאה או סדנה לארגון, או מעבר לאתר."
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
            </span>
          </Link>

          <a
            href="https://www.iiai.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('הזמנת הרצאה או סדנה לארגון', 'digital-card')}
            className="avi-action"
          >
            <span className="avi-action__icon">
              <Building2 size={22} strokeWidth={1.9} />
            </span>
            <span className="avi-action__text">
              <span className="avi-action__label">הזמנת הרצאה או סדנה לארגון</span>
            </span>
          </a>
        </nav>
      </main>
    </div>
  );
};

export default DigitalCard;
