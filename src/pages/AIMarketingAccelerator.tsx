import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Rocket, Users, BriefcaseBusiness, Layers3, CheckCircle2, Star } from "lucide-react";
import heroMain from "@/assets/backgrounds/hero/hero-background-16.png";
import heroAlt from "@/assets/backgrounds/hero/hero-background-18.png";

function AIMarketingAccelerator() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const topics = useMemo(
    () => [
      {
        title: "זיהוי הזדמנויות צמיחה",
        details:
          'נגלה יחד את "הזהב הנסתר" בעסק שלך ונראה איך למקם אותך בנישה רווחית שתמשוך את הקהל הנכון.',
      },
      {
        title: "הבנת צרכי הלקוחות",
        details:
          "נלמד להבין מה מניע את קהל היעד שלך, מה הוא אוהב ומה כואב לו, ואיך להציג את העסק שלך כפתרון שהוא ירצה לבחור בו.",
      },
      {
        title: "בניית מותג",
        details:
          "נבנה שפה שיווקית ייחודית וניצור קשר רגשי עם הקהל, כך שיזכור אותך וירצה להמשיך לעקוב אחריך.",
      },
      {
        title: "בידול מהמתחרים",
        details:
          "נלמד איך להבליט את הייחודיות שלך ולהפוך אותך לבחירה הטבעית של הלקוחות המושלמים.",
      },
      {
        title: "בניית הצעות שאי אפשר לסרב להן",
        details:
          "ניצור הצעות מכירה מפתות שמרגישות ללקוח כהזדמנות שלא חוזרת.",
      },
      {
        title: "יצירת תוכן שיווקי",
        details:
          "הפקת פוסטים, מאמרים וסרטונים תוך דקות, שמדברים בשפה של הלקוח ומובילים אותו לפעולה.",
      },
      {
        title: "שליחת מיילים שעובדים",
        details:
          "כתיבת מיילים אישיים שממירים עוקבים ללקוחות בצורה פשוטה ויעילה.",
      },
      {
        title: "משיכת לקוחות חדשים",
        details:
          "אסטרטגיות להזרמת לידים חדשים ואיכותיים, גם בלי להשקיע בפרסום ממומן.",
      },
      {
        title: "הדובדבן שבקצפת – דפי נחיתה",
        details:
          "יצירת עמודי הנעה לפעולה ועמודי נחיתה ממירים, שימקסמו את תוצאות הקמפיינים שלך.",
      },
      {
        title: "בונוס – מאסטר-קלאס מלא",
        details:
          "נבנה יחד דף נחיתה מעוצב, כולל מערכת דיוור וטופס הרשמה – ללא עלות וללא צורך בידע קודם.",
      },
    ],
    []
  );

  const benefits = [
    {
      Icon: Rocket,
      title: "האצה דרמטית של השיווק",
      text:
        "הפכו את ה‑AI לשותף מהיר ומדויק שמסייע לכם להוציא לפועל קמפיינים בקצב חסר תקדים.",
    },
    {
      Icon: Users,
      title: "מותאם אישית ל‑DNA של העסק",
      text:
        "לא עוד תוצאות גנריות – מודל עבודה שמדבר בשפה שלכם, ומתאים בדיוק לקהל שלכם.",
    },
    {
      Icon: BriefcaseBusiness,
      title: "חסכון בזמן ובעלויות",
      text:
        "החלפת שעות של ניסוי וטעייה בתבניות וזרימות עבודה מוכחות שמביאות תוצאות.",
    },
    {
      Icon: Layers3,
      title: "תשתית שגדלה איתכם",
      text:
        "ספריית כלים, תבניות ומשאבים שמתעדכנת – כך שתמיד תהיו צעד אחד לפני השוק.",
    },
  ];

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
        {/* HERO – WOW */}
        <section className="relative overflow-hidden pt-24 md:pt-28 pb-20 md:pb-28">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <img
              src={heroMain}
              alt="AI Marketing Accelerator abstract background"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
            <div className="absolute -top-20 -left-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-premium-float" />
            <div
              className="absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-premium-float"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          <div className="container max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
              {/* Copy */}
              <div className="text-right space-y-6 md:space-y-8 animate-premium-fade-in">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background/40 px-4 py-2 text-sm text-accent">
                  <Star className="h-4 w-4" /> תוכנית פרימיום לעסקים
                </span>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block">AI אקסלרטור שיווקי</span>
                  <span className="block premium-accent-gradient">הקורס שישנה את הדרך שבה את.ה מנהל.ת את העסק</span>
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl ml-auto">
                  הפכו את ה‑AI לשותף העסקי החכם, המהיר והמותאם אישית ביותר – כבר בשבועות הראשונים.
                </p>

                <div className="flex flex-wrap items-center justify-end gap-3 md:gap-4">
                  <Button size="lg" className="premium-glow" onClick={() => setIsContactOpen(true)}>
                    אני בפנים – דברו איתי
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => document.getElementById("syllabus")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    לראות את הסילבוס
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  בעולם שבו הזמן, היצירתיות והתחרות הם שלושת המטבעות החזקים – תנו ל‑AI לעבוד בשבילכם.
                </div>
              </div>

              {/* Visual collage */}
              <div className="relative h-[360px] md:h-[520px]">
                <div className="absolute right-0 top-6 w-[68%] h-[78%] rounded-3xl overflow-hidden premium-card shadow-xl">
                  <img
                    src={heroAlt}
                    alt="Creative AI marketing visuals"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute left-2 bottom-0 w-[50%] h-[48%] rounded-2xl overflow-hidden border border-border/50 bg-card">
                  <img src={heroMain} alt="AI workflow" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="absolute -left-4 -top-6 w-32 h-32 rounded-full bg-accent/20 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="container max-w-7xl px-4 md:px-6 py-12 md:py-20">
          <header className="mb-10 md:mb-14 text-right">
            <h2 className="text-2xl md:text-4xl font-semibold">למה זו התוכנית שלכם לנצח את השוק</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map(({ Icon, title, text }, i) => (
              <Card key={title} className="premium-card animate-premium-fade-in" style={{ animationDelay: `${i * 0.08}s` as string }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-accent" />
                    <CheckCircle2 className="h-5 w-5 text-accent/80" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* DIFFERENTIATOR */}
        <section className="relative py-12 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent/10 via-transparent to-accent/10" />
          <div className="container max-w-5xl px-4 md:px-6">
            <article className="rounded-3xl border border-accent/30 bg-background/60 backdrop-blur-xl p-6 md:p-10">
              <h3 className="text-xl md:text-3xl font-semibold mb-4 text-right">מה מבדל את הקורס הזה מכל מה שראית עד עכשיו</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground text-base leading-relaxed">
                <p>
                  בניגוד לעוד "קורס AI" שמלמד כלים באופן כללי, כאן תלמד איך להפוך את ה‑AI למותאם אישית לשפה, לאופי ול‑DNA הייחודי של העסק שלך,
                  כך שתבלוט מעל כל רעש השוק ותהפוך למותג שאי אפשר להתעלם ממנו.
                </p>
                <p>
                  התוצאה? AI שיודע לחשוב, לדבר ולפעול כמו העסק שלך – ולא כמו עוד מותג גנרי.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="container max-w-7xl px-4 md:px-6 py-12 md:py-20">
          <header className="mb-8 md:mb-12 text-right">
            <h3 className="text-2xl md:text-4xl font-semibold">מה תקבל בקורס</h3>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {["13 שיעורים מוקלטים (30–45 דקות) + עדכונים", "ספריית כלים ומשאבים מתקדמים",
              "תבניות מוכנות ליישום מיידי", "קבוצת תמיכה פעילה בקהילה סגורה"].map((t, i) => (
              <Card key={t} className="border-border/40 bg-card/60 backdrop-blur-xl animate-premium-fade-in" style={{ animationDelay: `${i * 0.06 + 0.1}s` as string }}>
                <CardHeader className="p-6">
                  <CardTitle className="text-base md:text-lg">{t}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* SYLLABUS */}
        <section id="syllabus" className="container max-w-6xl px-4 md:px-6 py-12 md:py-20">
          <header className="mb-6 md:mb-10 text-right">
            <h3 className="text-2xl md:text-4xl font-semibold">נושאים מרכזיים</h3>
          </header>
          <Accordion type="single" collapsible className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {topics.map((t, i) => (
              <AccordionItem key={t.title} value={`item-${i}`} className="border-border/40 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:bg-muted/30 text-right">{t.title}</AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-muted-foreground leading-relaxed">
                  {t.details}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* TESTIMONIALS CAROUSEL */}
        <section className="container max-w-6xl px-4 md:px-6 py-12 md:py-20">
          <header className="mb-6 md:mb-10 text-right">
            <h3 className="text-2xl md:text-4xl font-semibold">מה אומרים הבוגרים</h3>
          </header>
          <Carousel className="relative">
            <CarouselContent>
              {[
                '"בזכות הקורס מצאתי את הנישה שלי, בניתי הצעת ערך ברורה, וחסכתי אלפי שקלים על ייעוץ עסקי ודפי נחיתה."',
                '"ה‑AI הפך להיות ממש עובד צוות בעסק שלי – חוסך לי מעל 60% מהזמן."',
                '"השילוב בין אסטרטגיה לפרקטיקה גרם לי להוציא לפועל פי 3 תוכן – ולהכניס יותר לקוחות."',
              ].map((quote, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full premium-card">
                    <CardContent className="p-6 flex h-full items-start">
                      <p className="text-sm leading-7 text-muted-foreground">{quote}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </section>

        {/* PRICING – STICKY CTA ON DESKTOP */}
        <section className="container max-w-7xl px-4 md:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4 text-muted-foreground">
              <h4 className="text-xl md:text-2xl font-semibold text-foreground">ההשקעה שלך</h4>
              <p>גישה לכל התכנים ללא הגבלת זמן – אתה חוזר מתי שאתה רוצה, לומד בקצב שלך.</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["ליווי קהילתי תומך", "עדכוני תכנים שוטפים", "טמפלטים מוכנים לעבודה", "שיטות עבודה מוכחות"].map((li) => (
                  <li key={li} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="premium-card sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-end gap-3">
                  <div className="text-4xl md:text-5xl font-bold">690 ₪</div>
                  <div className="text-muted-foreground line-through text-xl">1,490 ₪</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">החזר השקעה כבר ב‑3 השבועות הראשונים</p>
                <div className="mt-5 flex flex-col gap-3">
                  <Button size="lg" onClick={() => setIsContactOpen(true)} className="premium-glow">
                    להירשם עכשיו
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    לגלול לראש העמוד
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

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

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-xl p-3 md:hidden">
        <div className="container flex items-center justify-between gap-3">
          <div>
            <div className="text-sm">מחיר השקה</div>
            <div className="text-lg font-semibold">690 ₪ <span className="text-muted-foreground line-through text-sm align-middle mr-2">1,490 ₪</span></div>
          </div>
          <Button size="lg" onClick={() => setIsContactOpen(true)} className="premium-glow">להצטרפות</Button>
        </div>
      </div>

      <Footer />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default AIMarketingAccelerator;
