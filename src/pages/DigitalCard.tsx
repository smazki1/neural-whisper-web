import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, MessageCircle, CalendarCheck, Globe } from 'lucide-react';
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

  const actionClass =
    'group flex items-center gap-4 w-full rounded-2xl border border-border bg-card px-5 py-4 text-right transition-all duration-200 hover:border-brand-accent hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 min-h-[64px]';

  const iconClass =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-secondary transition-colors group-hover:bg-brand-accent';

  return (
    <div dir="rtl" className="min-h-screen bg-background font-heebo">
      <SEOHead
        title="אבי פריד – כרטיס ביקור דיגיטלי | AI Master"
        description="אבי פריד, מרצה ויועץ לבינה מלאכותית מעשית. שמירת פרטי קשר, שליחת הודעה בוואטסאפ או הזמנת הרצאה וסדנה."
        noIndex
      />

      <main id="main-content" className="mx-auto w-full max-w-md px-5 py-8">
        {/* Top area */}
        <header className="text-center">
          <p className="text-sm font-bold tracking-wide text-brand-secondary">AI Master</p>

          <img
            src={aviPortrait}
            alt="אבי פריד, מרצה ויועץ לבינה מלאכותית"
            className="mx-auto mt-5 h-28 w-28 rounded-full object-cover object-center shadow-lg ring-4 ring-brand-accent/40"
            loading="eager"
          />

          <h1 className="mt-5 text-3xl font-bold text-foreground">אבי פריד</h1>
          <p className="mt-1 text-base font-medium text-brand-secondary">
            מרצה ויועץ לבינה מלאכותית מעשית
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            עוזר לאנשים ולארגונים להפוך את ה-AI לכלי עבודה פשוט, שימושי ומעשי.
          </p>
        </header>

        {/* Actions */}
        <nav aria-label="פעולות מרכזיות" className="mt-8 space-y-3">
          <button type="button" onClick={handleSaveContact} className={actionClass}>
            <span className={iconClass}>
              <UserPlus size={22} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-foreground">שמירת אבי באנשי הקשר</span>
              <span className="block text-xs text-muted-foreground">הורדת כרטיס איש קשר</span>
            </span>
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('WhatsApp', 'digital-card')}
            className={actionClass}
          >
            <span className={iconClass}>
              <MessageCircle size={22} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-foreground">שליחת הודעה ב-WhatsApp</span>
              <span className="block text-xs text-muted-foreground">{PHONE_DISPLAY}</span>
            </span>
          </a>

          <Link
            to="/contact?source=digital-card"
            onClick={() => trackCTAClick('הזמנת הרצאה או סדנה', 'digital-card')}
            className={actionClass}
          >
            <span className={iconClass}>
              <CalendarCheck size={22} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-foreground">הזמנת הרצאה או סדנה</span>
              <span className="block text-xs text-muted-foreground">מעבר לטופס יצירת קשר</span>
            </span>
          </Link>

          <Link
            to="/"
            onClick={() => trackCTAClick('מעבר לאתר AI Master', 'digital-card')}
            className={actionClass}
          >
            <span className={iconClass}>
              <Globe size={22} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-foreground">מעבר לאתר AI Master</span>
              <span className="block text-xs text-muted-foreground">ai-master.co.il</span>
            </span>
          </Link>
        </nav>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <a href={`mailto:${EMAIL}`} className="hover:text-brand-secondary hover:underline">
            {EMAIL}
          </a>
        </p>
      </main>
    </div>
  );
};

export default DigitalCard;
