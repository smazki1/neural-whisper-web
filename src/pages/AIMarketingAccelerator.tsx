import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import heroBg from "@/assets/backgrounds/hero/hero-background-18.png";

function AIMarketingAccelerator() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="bg-background text-foreground font-['Heebo']">
      <Helmet>
        <title>AI אקסלרטור שיווקי – קורס דיגיטלי לעסקים</title>
        <meta name="description" content="הפכו את ה‑AI לשותף העסקי הכי מהיר ומותאם אישית. קורס דיגיטלי שיקפיץ שיווק, מכירות ותוכן כבר בשבועות הראשונים." />
        <link rel="canonical" href="/landing/ai-marketing-accelerator" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar onContactClick={() => setIsContactOpen(true)} />

      <main dir="rtl" className="animate-fade-in">
        {/* Hero */}
        <section
          className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-20 pb-24"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/80 to-background/95" />
          <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-6xl text-center space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              AI אקסלרטור שיווקי – הקורס הדיגיטלי שישנה את הדרך שבה את.ה מנהל.ת את העסק שלך
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              הפכו את ה‑AI לשותף העסקי החכם, המהיר והמותאם אישית ביותר שלכם – כבר בשבועות הראשונים.
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <Button size="lg" onClick={() => setIsContactOpen(true)} className="hover-scale">
                רוצה להתחיל עכשיו
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" })} className="hover-scale">
                לראות מה לומדים
              </Button>
            </div>
            <div className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground">
              בעולם שבו הזמן, היצירתיות והתחרות הם שלושת המטבעות החזקים ביותר – הקורס הזה מעניק מערכת כלים שתאפשר לך לשווק, למכור ולייצר תוכן בקצב שאף מתחרה לא יוכל לעמוד בו.
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="container mx-auto px-4 md:px-6 max-w-6xl py-14 md:py-20">
          <header className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-semibold">למי זה מיועד</h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              "בעלי עסקים קטנים ובינוניים שרוצים לפרוץ קדימה.",
              "יועצים, פרילנסרים ואנשי מקצוע שרוצים למתג את עצמם בצורה חדה וייחודית.",
              "אנשים המעוניינים להתחיל לבנות את המיזם האישי שלהם לצד עבודתם הנוכחית.",
            ].map((text, i) => (
              <Card key={i} className="glassmorphism-dark border-border/40 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` as string }}>
                <CardContent className="p-6 text-base md:text-lg">{text}</CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">לכל רמה – ממתחילים ועד מתקדמים.</p>
        </section>

        {/* Differentiator */}
        <section className="relative py-14 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-primary/10" />
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <article className="glassmorphism-dark border border-primary/20 rounded-2xl p-6 md:p-10 animate-fade-in">
              <h3 className="text-xl md:text-3xl font-semibold mb-4">מה מבדל את הקורס הזה מכל מה שראית עד עכשיו</h3>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                בניגוד לעוד "קורס AI" שמלמד כלים באופן כללי, כאן תלמד איך להפוך את ה‑AI למותאם אישית לשפה, לאופי ול‑DNA הייחודי של העסק שלך, כך שתבלוט מעל כל רעש השוק ותהפוך למותג שאי אפשר להתעלם ממנו.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-4">
                התוצאה? AI שיודע לחשוב, לדבר ולפעול כמו העסק שלך – ולא כמו עוד מותג גנרי.
              </p>
            </article>
          </div>
        </section>

        {/* What you get */}
        <section className="container mx-auto px-4 md:px-6 max-w-6xl py-14 md:py-20">
          <header className="text-center mb-10 md:mb-14">
            <h3 className="text-2xl md:text-4xl font-semibold">מה תקבל בקורס</h3>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              "13 שיעורים מוקלטים (30–45 דקות כל אחד) + עדכונים שוטפים",
              "גישה ללא הגבלה לספריית כלים ומשאבים מתקדמים",
              "תבניות מוכנות ליישום מיידי",
              "קבוצת תמיכה פעילה בקהילה סגורה",
            ].map((t, i) => (
              <Card key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.06 + 0.1}s` as string }}>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">{t}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Topics */}
        <section id="topics" className="container mx-auto px-4 md:px-6 max-w-6xl py-14 md:py-20">
          <header className="text-center mb-10 md:mb-14">
            <h3 className="text-2xl md:text-4xl font-semibold">נושאים מרכזיים</h3>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              "זיהוי הזדמנויות צמיחה – נגלה יחד את \"הזהב הנסתר\" בעסק שלך ונראה איך למקם אותך בנישה רווחית שתמשוך את הקהל הנכון.",
              "הבנת צרכי הלקוחות – נלמד להבין מה מניע את קהל היעד שלך, מה הוא אוהב ומה כואב לו, ואיך להציג את העסק שלך כפתרון שהוא ירצה לבחור בו.",
              "בניית מותג – נבנה שפה שיווקית ייחודית וניצור קשר רגשי עם הקהל, כך שיזכור אותך וירצה להמשיך לעקוב אחריך.",
              "בידול מהמתחרים – נלמד איך להבליט את הייחודיות שלך ולהפוך אותך לבחירה הטבעית של הלקוחות המושלמים.",
              "בניית הצעות שאי אפשר לסרב להן – ניצור הצעות מכירה מפתות שמרגישות ללקוח כהזדמנות שלא חוזרת.",
              "יצירת תוכן שיווקי – הפקת פוסטים, מאמרים וסרטונים תוך דקות, שמדברים בשפה של הלקוח ומובילים אותו לפעולה.",
              "שליחת מיילים שעובדים – כתיבת מיילים אישיים שממירים עוקבים ללקוחות בצורה פשוטה ויעילה.",
              "משיכת לקוחות חדשים – אסטרטגיות להזרמת לידים חדשים ואיכותיים, גם בלי להשקיע בפרסום ממומן.",
              "הדובדבן שבקצפת – כתיבת דפי נחיתה מנצחים – יצירת עמודי הנעה לפעולה ועמודי נחיתה ממירים, שימקסמו את תוצאות הקמפיינים שלך.",
              "בונוס ייחודי – שיעור מאסטר‑קלאס מלא: דף נחיתה מעוצב ברמה הגבוהה ביותר, כולל מערכת דיוור אוטומטית וטופס הרשמה – ללא עלות וללא צורך בידע קודם.",
            ].map((item, i) => (
              <Card key={i} className="border-border/50 animate-fade-in hover-scale" style={{ animationDelay: `${i * 0.04 + 0.1}s` as string }}>
                <CardContent className="p-6 text-base leading-relaxed text-muted-foreground">{item}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="relative py-14 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/10 via-transparent to-primary/10" />
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <Card className="glassmorphism-dark border border-primary/20 rounded-2xl p-0 overflow-hidden animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl md:text-3xl">ההשקעה שלך</CardTitle>
                    <CardDescription className="text-base md:text-lg">גישה לכל התכנים ללא הגבלת זמן – לומדים בקצב שמתאים לכם.</CardDescription>
                  </CardHeader>
                  <div className="mt-6 flex items-end gap-3">
                    <div className="text-4xl md:text-5xl font-bold">690 ₪</div>
                    <div className="text-muted-foreground line-through text-xl">1,490 ₪</div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">החזר השקעה כבר ב‑3 השבועות הראשונים.</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button size="lg" onClick={() => setIsContactOpen(true)} className="hover-scale">להצטרפות</Button>
                    <Button size="lg" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover-scale">למעלה</Button>
                  </div>
                </div>
                <div className="p-8 md:p-10 bg-muted/30">
                  <h4 className="text-lg md:text-xl font-semibold mb-3">מה אומרים הבוגרים</h4>
                  <ul className="space-y-4 text-muted-foreground">
                    <li>"בזכות הקורס מצאתי את הנישה שלי, בניתי הצעת ערך ברורה, וחסכתי אלפי שקלים על ייעוץ עסקי ודפי נחיתה."</li>
                    <li>"ה‑AI הפך להיות ממש עובד צוות בעסק שלי – חוסך לי מעל 60% מהזמן."</li>
                  </ul>
                  <h4 className="text-lg md:text-xl font-semibold mt-6 mb-3">הבטחה</h4>
                  <p className="text-muted-foreground">זה לא עוד קורס שמוסיף ידע למגירה – זה שדרוג מערכתי לעסק שלך. בתוך פחות מחודש יהיה לך AI שמבין את השפה שלך, את הלקוחות שלך ואת הדרך שלך לנצח בשוק.</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* JSON-LD */}
        <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify({
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
        })}</script>
      </main>

      <Footer />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default AIMarketingAccelerator;
