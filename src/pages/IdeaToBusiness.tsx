import "./idea-to-business.css";
import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowLeft,
  Trophy,
  Zap,
} from "lucide-react";
import { SEOHead } from "@/components/SEO/SEOHead";
import { useProductCheckout } from "@/hooks/useProductCheckout";
import { ideaToBusiness } from "@/content/ideaToBusiness";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import heroBackground01 from "@/assets/backgrounds/hero/hero-background-01.png";
import heroBackground02 from "@/assets/backgrounds/hero/hero-background-02.png";
import {
  AboutAviSection, AvailableLessons, DraftNote, FAQSection, LibrarySection,
  OutputsSection, PossibilitiesSection, ReviewChecklist, SolutionSection,
  TestimonialsSection, TimeSection, UpcomingLibraryCards, VibeCodingSection,
} from "@/components/idea-to-business/LandingSections";

const IdeaToBusiness = () => {
  const { price } = ideaToBusiness;
  const { checkoutUrl, checkoutLoading } = useProductCheckout();
  const { trackEvent } = useAnalytics();
  const preview = import.meta.env.DEV;
  const purchaseClick = () =>
    trackEvent({
      action: "course_checkout_click",
      category: "course",
      label: "idea-to-business",
      value: price,
    });
  const suitableFor = [
    "מי שיש להם ידע, ניסיון או רעיון ורוצים להפוך אותם למוצר",
    "מי שיש להם כמה כיוונים ורוצים לבחור במה להתמקד",
    "בעלי עסקים שרוצים לפתח מוצר חדש או לחדד הצעה קיימת",
    "מי שמוכנים ללמוד, להתנסות ולקבל החלטות לאורך הדרך",
  ];

  const notSuitableFor = [
    "מי שמחפשים הבטחה להכנסה או למכירות בלי לבדוק את השוק",
    "מי שמעדיפים לצפות בלבד בלי ליישם על הרעיון שלהם",
    "מי שמצפים שה־AI יקבל עבורם את כל ההחלטות העסקיות",
  ];

  const bonuses = [
    {
      title: "לומדים ומיישמים",
      items: [
        "קורס מוקלט בעברית, ללמידה בקצב שלכם",
        "הדגמות והנחיות מוכנות לעבודה עם AI",
        "גיליונות עבודה שמרכזים את ההחלטות והתוצרים",
      ],
    },
    {
      title: "תמיכה במהלך הדרך",
      items: [
        "קבוצת WhatsApp לתמיכה במהלך הלמידה והיישום",
        "גישה לכל החיים לתוכן הקורס",
      ],
    },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="idea-to-business min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"
      dir="rtl"
    >
      <SEOHead
        title="מרעיון לעסק עם AI | הקורס של אבי פריד"
        description="מפתחים כיוון עסקי, מוצר והצעה ובונים דף נחיתה בעזרת AI. קורס מוקלט בעברית, גישה לכל החיים, עדכונים וקבוצת WhatsApp לתמיכה."
        noIndex={!checkoutUrl}
      />
      <nav
        id="main-navigation"
        aria-label="ניווט בעמוד"
        className="sr-only focus-within:not-sr-only"
      >
        <a href="#available-lessons">לתוכנית הקורס</a>
      </nav>
      {preview && !checkoutUrl && (
        <aside className="bg-yellow-100 text-yellow-950 text-sm text-center px-6 py-2">
          תצוגה מקדימה לאבי · יש להשלים קישור תשלום לפני הפרסום
        </aside>
      )}
      {/* Hero Section */}
      <section className="relative min-h-screen py-16 md:py-24 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground01})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-slate-900/80"></div>
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 mb-6 leading-tight"
          >
            להפוך את הרעיון שלך לעסק
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-100 font-medium mb-6 max-w-3xl mx-auto leading-relaxed"
          >
            <strong className="text-yellow-300">״מרעיון לעסק עם AI״</strong> הוא קורס חדשני לבעלי עסקים ועצמאים שרוצים להשתמש ב-AI כדי ליצור, לפתח ולבנות את העסק בצורה חכמה ויעילה יותר, בלי להיות תלויים בכל שלב באיש מקצוע אחר.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6"
          >
            <Button
              asChild
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg md:text-2xl px-6 md:px-16 py-8 h-auto md:h-11 whitespace-normal max-w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <a href="#enroll">אני רוצה להתחיל לבנות את העסק שלי עם AI</a>
            </Button>

          </motion.div>

        </div>
      </section>

      {/* Problem Section */}
      <section
        id="course-problem"
        className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBackground02})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16"
          >
            יש לכם רעיון טוב, אבל אתם לא באמת יודעים מה הצעד הבא?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed"
          >
            <p>אולי עלה לכם רעיון למוצר חדש, אבל אתם לא יודעים מאיפה להתחיל.</p>
            <p>אולי העסק כבר קיים, אבל אתם מרגישים שאתם עובדים קשה, עושים המון דברים, ובכל זאת לא באמת מתקדמים בקצב שהייתם רוצים.</p>
            <p>ואולי אתם כל הזמן שואלים את עצמכם:</p>
            <ul className="space-y-2">
              <li>האם זה המוצר הנכון?</li>
              <li>איך אני יודע מה הלקוחות שלי באמת ירצו?</li>
              <li>איך נכון להציג ולמכור את מה שאני מציע?</li>
              <li>מה אני צריך לעשות קודם?</li>
              <li>ואיך אני אמור לבנות את כל זה בלי לבזבז שבועות על כל שלב?</li>
            </ul>
            <p>בפועל, המון זמן הולך על לחשוב, לבדוק, לשנות כיוון, לחפש אנשי מקצוע ולהתחיל שוב מחדש.</p>
            <p className="text-blue-900 font-bold">
              לא חסרים לכם רעיונות.<br />חסרה לכם דרך ברורה לקחת רעיון ולהפוך אותו למשהו שאפשר לצאת איתו לשוק.
            </p>
          </motion.div>
        </div>
      </section>

      <SolutionSection />
      <PossibilitiesSection />
      <VibeCodingSection />
      <OutputsSection />
      <LibrarySection />

      {/* Bonuses Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-900/20 via-gray-900 to-orange-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(234,179,8,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-16"
          >
            מה מקבלים בפועל
          </motion.h2>

          <AvailableLessons />
          <UpcomingLibraryCards />
          <aside aria-labelledby="launch-offer-heading" className="mx-auto mb-10 max-w-4xl rounded-3xl border border-yellow-300/30 bg-slate-900 px-6 py-8 sm:px-10 md:py-10">
            <div className="mx-auto max-w-xl text-center">
              <h3 id="launch-offer-heading" className="text-3xl md:text-[40px] font-bold text-white">כל זה במחיר השקה</h3>
              <p className="mt-4 flex items-baseline justify-center gap-3 text-yellow-300" aria-label={`מחיר השקה ${price} שקלים`}>
                <span className="text-[88px] md:text-[104px] font-bold leading-none tracking-tight">{price}</span>
                <span className="text-4xl md:text-5xl font-bold" aria-hidden="true">₪</span>
              </p>
              <p className="mt-3 flex items-baseline justify-center gap-3 text-[28px] md:text-4xl font-semibold leading-tight text-slate-200">
                <span>במקום</span>
                <del><bdi>{ideaToBusiness.fullPrice.toLocaleString("he-IL")} ₪</bdi></del>
              </p>
              <a href="#enroll" className="mx-auto mt-5 flex w-full max-w-md items-center justify-center rounded-xl bg-yellow-300 px-5 py-4 text-2xl md:text-[28px] font-bold text-slate-950 transition-colors hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300">לפרטי ההרשמה</a>
            </div>
          </aside>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bonuses.map((bonus, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/20"
              >
                <div className="flex items-center mb-6">
                  <Trophy className="h-8 w-8 text-yellow-400 ml-3" />
                  <h3 className="text-xl font-bold text-yellow-400">
                    {bonus.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {bonus.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center space-x-3 space-x-reverse"
                    >
                      <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <AboutAviSection />

      {/* Target Audience */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-red-50/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid items-start md:grid-cols-2 gap-5 md:gap-6">
            {/* Suitable For */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-7 shadow-xl border border-green-200/50">
                <h3 className="text-2xl font-bold text-green-600 mb-5 text-center flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 ml-3" />
                  למי זה מתאים
                </h3>
                <div className="space-y-2">
                  {suitableFor.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3 space-x-reverse px-1 py-2 rounded-lg hover:bg-green-50/50 transition-colors"
                    >
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Not Suitable For */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-7 shadow-xl border border-red-200/50">
                <h3 className="text-2xl font-bold text-red-600 mb-5 text-center flex items-center justify-center">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-red-500 flex items-center justify-center ml-3">
                    <span className="text-white text-lg">✕</span>
                  </div>
                  למי זה לא מתאים
                </h3>
                <div className="space-y-2">
                  {notSuitableFor.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3 space-x-reverse px-1 py-2 rounded-lg hover:bg-red-50/50 transition-colors"
                    >
                      <div className="h-6 w-6 flex-shrink-0 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white text-xs">✕</span>
                      </div>
                      <span className="text-gray-800 font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TimeSection />

      {/* CTA before frequently asked questions */}
      <section className="py-20 bg-gradient-to-br from-blue-950 via-purple-900 to-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBackground01})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/80 to-slate-900/70"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8"
          >
            הרעיון הזה כבר חיכה מספיק.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white mb-8 max-w-3xl mx-auto"
          >
            התחילו מהרעיון שאתם רוצים לקדם. למדו לחשוב, לפתח ולבנות בעזרת AI, עם דרך עבודה שתוכלו לחזור אליה גם ברעיון הבא.
          </motion.p>

          <DraftNote className="max-w-xl mx-auto mb-6">נוסח CTA סופי לבחירתך. נשמר כפתור הרכישה הקיים לצורך בדיקה.</DraftNote>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {checkoutUrl && !checkoutLoading ? (
              <Button
                asChild
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl md:text-2xl px-8 md:px-16 py-8 h-auto md:h-11 whitespace-normal max-w-full rounded-lg"
              >
                <a href={checkoutUrl} onClick={purchaseClick}>
                  לרכישת הקורס ב־{price} ש״ח
                </a>
              </Button>
            ) : (
              <>
                <Button
                  disabled
                  aria-describedby="checkout-pending"
                  className="bg-yellow-500 text-black font-bold text-xl md:text-2xl px-8 md:px-16 py-8 h-auto md:h-11 whitespace-normal max-w-full rounded-lg"
                >
                  לרכישת הקורס ב־{price} ש״ח
                </Button>
                <p id="checkout-pending" className="mt-3 text-sm text-gray-200">
                  {checkoutLoading ? "טוען אפשרות רכישה..." : preview
                    ? "הכפתור ממתין לקישור התשלום שלך."
                    : "ההרשמה אינה זמינה כרגע."}
                </p>
              </>
            )}
          </motion.div>

        </div>
      </section>

      <FAQSection />

      {/* Pricing Section */}
      <section id="enroll" aria-labelledby="enroll-heading" className="bg-slate-50 py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-5 sm:px-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-900 px-6 py-8 md:px-12 md:py-10 text-center text-white shadow-[0_24px_64px_-36px_rgba(15,23,42,0.5)]">
            <h2 id="enroll-heading" className="text-3xl md:text-4xl font-bold">מרעיון לעסק עם AI</h2>

            <div className="mt-7">
              <p className="text-lg font-bold text-yellow-300">מחיר השקה</p>
              <p className="mt-2 flex items-baseline justify-center gap-2" aria-label={`מחיר השקה ${price} שקלים`}>
                <span className="text-[80px] md:text-[96px] font-bold leading-none tracking-tight">{price}</span>
                <span className="text-3xl font-medium text-slate-300" aria-hidden="true">₪</span>
              </p>
              <p className="mt-3 text-base text-slate-300">במקום <del className="mr-1"><bdi>{ideaToBusiness.fullPrice.toLocaleString("he-IL")} ₪</bdi></del></p>
            </div>

            <div className="mx-auto mt-7 max-w-sm">
              {checkoutUrl && !checkoutLoading ? (
                <Button asChild className="w-full h-auto min-h-14 rounded-xl bg-yellow-300 px-5 py-4 text-lg font-bold text-slate-950 hover:bg-yellow-200 focus-visible:ring-yellow-300 focus-visible:ring-offset-slate-900">
                  <a href={checkoutUrl} onClick={purchaseClick}>לרכישת הקורס <ArrowLeft className="mr-3 h-5 w-5" aria-hidden="true" /></a>
                </Button>
              ) : (
                <Button disabled aria-describedby="price-checkout-pending" className="w-full h-auto min-h-14 rounded-xl bg-yellow-300 px-5 py-4 text-lg font-bold text-slate-950">
                  {checkoutLoading ? "טוען אפשרות רכישה..." : "לרכישת הקורס"}
                </Button>
              )}
              {(!checkoutUrl || checkoutLoading) && (
                <p id="price-checkout-pending" className="mt-3 text-sm text-slate-300">
                  {checkoutLoading ? "בודקים את אפשרות הרכישה." : preview ? "הכפתור ממתין לקישור התשלום שלך." : "ההרשמה אינה זמינה כרגע."}
                </p>
              )}
            </div>

          </div>

          <div className="mx-auto mt-9 md:mt-10 max-w-xl text-center">
            <h3 className="text-xl md:text-2xl font-bold text-blue-900">מה צריך כדי להתחיל?</h3>
            <p className="mt-3 text-lg leading-relaxed text-slate-700">רעיון או עסק שתרצו לקדם, וידע בסיסי במחשב ובדפדפן.</p>
            <p className="mt-4 text-base leading-7 text-slate-600">לעבודה בקורס תצטרכו חשבון ChatGPT ומסמך Google Docs ריק.<br className="hidden sm:block" /> אפשר להתחיל גם עם חשבון ChatGPT חינמי.</p>
          </div>
        </div>
      </section>
      <ReviewChecklist />
    </main>
  );
};

export default IdeaToBusiness;
