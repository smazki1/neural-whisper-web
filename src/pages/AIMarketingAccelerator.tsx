import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import Hero from "./AIMarketingAccelerator/sections/Hero";
import Benefits from "./AIMarketingAccelerator/sections/Benefits";
import Differentiator from "./AIMarketingAccelerator/sections/Differentiator";
import Syllabus from "./AIMarketingAccelerator/sections/Syllabus";
import Testimonials from "./AIMarketingAccelerator/sections/Testimonials";
import Pricing from "./AIMarketingAccelerator/sections/Pricing";
import StickyMobileCTA from "./AIMarketingAccelerator/sections/StickyMobileCTA";

function AIMarketingAccelerator() {
  const [isContactOpen, setIsContactOpen] = useState(false);



  return (
    <div className="bg-background text-foreground">
      <Helmet>
        <title>AI אקסלרטור שיווקי – קורס דיגיטלי לעסקים</title>
        <meta
          name="description"
          content="קורס AI שמותאם אישית לעסק שלך: שיווק, תוכן ומכירות בקצב מנצח – עם תשתית שעובדת בשבילך."
        />
        <link rel="canonical" href="/landing/ai-marketing-accelerator" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar onContactClick={() => setIsContactOpen(true)} />

      <main dir="rtl" className="min-h-screen">
        {/* הירו חדש בסגנון ההשראה */}
        <Hero
          onPrimary={() => setIsContactOpen(true)}
          onSecondary={() => document.getElementById("syllabus")?.scrollIntoView({ behavior: "smooth" })}
        />

        {/* קהל יעד קצר וזורם */}
        <section className="container max-w-6xl px-4 md:px-6 pb-6 md:pb-10 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl p-5">
              <h3 className="text-lg md:text-xl font-semibold mb-2">למי זה מיועד</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>בעלי עסקים קטנים ובינוניים שרוצים לפרוץ קדימה.</li>
                <li>יועצים, פרילנסרים ואנשי מקצוע שרוצים למתג את עצמם בצורה חדה וייחודית.</li>
                <li>אנשים המעוניינים להתחיל לבנות את המיזם האישי שלהם לצד עבודתם הנוכחית.</li>
                <li>לכל רמה – ממתחילים ועד מתקדמים.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl p-5">
              <h3 className="text-lg md:text-xl font-semibold mb-2">הבטחה</h3>
              <p className="text-muted-foreground">זה לא עוד קורס שמוסיף לך ידע למגירה. זה שדרוג מערכתי לעסק שלך. תוך פחות מחודש, יהיה לך AI שמבין את השפה שלך, את הלקוחות שלך, ואת הדרך שלך לנצח בשוק.</p>
            </div>
          </div>
        </section>

        <Benefits />
        <Differentiator />

        {/* מה תקבל */}
        <section className="container max-w-7xl px-4 md:px-6 py-12 md:py-20">
          <header className="mb-8 md:mb-12 text-right">
            <h3 className="text-2xl md:text-4xl font-semibold">מה תקבל בקורס</h3>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {["13 שיעורים מוקלטים (30–45 דקות) + עדכונים", "ספריית כלים ומשאבים מתקדמים", "תבניות מוכנות ליישום מיידי", "קבוצת תמיכה פעילה בקהילה סגורה"].map((t,i)=> (
              <div key={t} className="rounded-2xl border border-border/40 bg-card/70 backdrop-blur-xl p-6 animate-fade-in" style={{ animationDelay: `${i*80}ms` as string }}>
                <div className="text-base md:text-lg">{t}</div>
              </div>
            ))}
          </div>
        </section>

        <Syllabus />
        <Testimonials />
        <Pricing onPrimary={() => setIsContactOpen(true)} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              name: "AI אקסלרטור שיווקי",
              description:
                "קורס דיגיטלי שמלמד להפוך את ה‑AI לשותף עסקי מותאם אישית לשיווק, מכירות ותוכן.",
              provider: { "@type": "Organization", name: "Your Brand" },
              offers: {
                "@type": "Offer",
                price: "690",
                priceCurrency: "ILS",
                url: "/landing/ai-marketing-accelerator",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </main>

      <StickyMobileCTA onPrimary={() => setIsContactOpen(true)} />

      <Footer />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default AIMarketingAccelerator;
