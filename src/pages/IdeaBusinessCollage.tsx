import { SEOHead } from "@/components/SEO/SEOHead";
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ideaToBusiness } from "@/content/ideaToBusiness";
import { useProductCheckout } from "@/hooks/useProductCheckout";
import { AboutAndProof, CourseContents, FitAndLearning, Questions, Reveal } from "@/components/idea-to-business/collage/CollageSections";
import { BusinessStory } from "@/components/idea-to-business/collage/BusinessStory";
import { BusinessHeroArt } from "@/components/idea-to-business/collage/BusinessHeroArt";
import "./idea-business-collage.css";
import "./idea-business-collage-expanded.css";
import "./idea-business-multi.css";
import "./idea-business-brand.css";
import "./idea-business-type.css";
import "./idea-business-night.css";

export default function IdeaBusinessCollage() {
  const { checkoutUrl, checkoutLoading } = useProductCheckout();
  const { trackEvent } = useAnalytics();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32 });
  return <main className="collage-page collage-expanded business-page" id="main-content" tabIndex={-1} dir="rtl">
    <SEOHead
      title="מרעיון לעסק עם AI | הקורס של אבי פריד"
      description="מפתחים כיוון עסקי, מוצר והצעה ובונים דף נחיתה בעזרת AI. קורס מוקלט בעברית, גישה לכל החיים, עדכונים וקבוצת WhatsApp לתמיכה."
      noIndex={!checkoutUrl}
    />
    <motion.div className="cw-reading-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} aria-hidden="true" />
    <div className="night-opening">
      <header className="collage-nav night-nav" id="main-navigation">
        <a className="collage-brand" href="#main-content"><bdi>AI MASTER</bdi></a>
        <nav aria-label="ניווט בעמוד">
          <a href="#collage-process">איך זה עובד</a>
          <a href="#course-curriculum">מה לומדים</a>
          <a className="nav-enroll" href="#enroll">לפרטי ההצטרפות</a>
        </nav>
      </header>
      <section className="night-hero" aria-labelledby="collage-title">
        <div className="night-hero-copy">
          <h1 id="collage-title">
            <span>יש לכם מה לתת.</span>
            בואו נהפוך את זה<br />למשהו שאפשר למכור.
          </h1>
          <p>רעיון שאתם רוצים להוציא לפועל. ידע וניסיון שאחרים נעזרים בהם. שירות קיים שאתם רוצים לפתח.</p>
          <p>בקורס תלמדו לפתח מוצר או שירות ולבנות לו מותג ואתר עם AI, כדי לחסוך זמן עבודה והוצאות על אנשי מקצוע.</p>
          <a className="collage-button night-action" href="#collage-process">מה תוכלו ליצור עם AI</a>
        </div>
        <BusinessHeroArt />
      </section>
    </div>
    <BusinessStory />
    <section className="cook-your-turn cw-shell">
      <Reveal><h2>למה שהלקוחות<br /><em>יבחרו דווקא בכם?</em></h2></Reveal>
      <Reveal><p className="cw-body">יכול להיות שאתם מקימים עסק, מפתחים מוצר חדש או רוצים לתת לשירות הקיים שלכם כיוון ברור יותר.</p><p className="cw-body">תלמדו לזהות מי הכי צריך את מה שאתם מציעים, ולפתח עבורו מוצר או שירות שנותן מענה מדויק וסיבה לקנות דווקא מכם.</p><a className="collage-button" href="#course-curriculum">מה לומדים בקורס</a></Reveal>
    </section>
    {/* RealWorkPreview is temporarily hidden; the component and demos are preserved. */}
    <AboutAndProof />
    <FitAndLearning />
    <CourseContents />
    <Questions />
    <section className="collage-enrollment" id="enroll" aria-labelledby="enrollment-title">
      <Reveal className="enrollment-copy"><h2 id="enrollment-title">יש לכם<br />מה לתת.<br /><em>בואו נתחיל<br />לעבוד על זה.</em></h2><div className="cw-start-kit"><span>מה צריך כדי להתחיל?</span><p>רעיון או עסק, ידע בסיסי במחשב וחשבון <bdi>ChatGPT</bdi>. אפשר להתחיל בחשבון חינמי.</p></div></Reveal>
      <Reveal><aside className="collage-purchase" aria-label="הרשמה לקורס"><span className="purchase-tab">מה כלול בקורס</span><p className="tiny-label">AI MASTER / אבי פריד</p><h3>מרעיון לעסק<br />עם AI</h3><div className="collage-price"><strong><bdi>{ideaToBusiness.price} ₪</bdi></strong><span>מחיר השקה</span></div><ul><li>12 שיעורים מוקלטים בעברית, בקצב שלכם</li><li>הדגמות, הנחיות וגיליונות עבודה</li><li>קבוצת WhatsApp לתמיכה</li><li>גישה לכל החיים לתוכן הקורס</li><li>גישה לתכנים שיתווספו בהמשך</li></ul>{checkoutUrl && !checkoutLoading ? (
        <a className="collage-button" href={checkoutUrl} onClick={() => trackEvent({
          action: "course_checkout_click", category: "course", label: "idea-to-business", value: ideaToBusiness.price,
        })}>אני רוצה להצטרף <span aria-hidden="true">←</span></a>
      ) : (
        <button className="collage-button" disabled>{checkoutLoading ? "טוען אפשרות רכישה..." : "ההרשמה אינה זמינה כרגע."}</button>
      )}</aside></Reveal>
    </section>
    <footer className="collage-footer"><bdi>AI MASTER / אבי פריד</bdi><nav aria-label="קישורי מידע"><a href="/privacy-policy">פרטיות</a><a href="/terms-of-service">תנאי שימוש</a></nav></footer>
  </main>;
}
