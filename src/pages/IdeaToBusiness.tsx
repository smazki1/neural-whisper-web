import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Users,
  Trophy,
  Zap,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  ChevronDown,
} from "lucide-react";
import { SEOHead } from "@/components/SEO/SEOHead";
import { useProductCheckout } from "@/hooks/useProductCheckout";
import { ideaToBusiness } from "@/content/ideaToBusiness";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import heroBackground01 from "@/assets/backgrounds/hero/hero-background-01.png";
import heroBackground02 from "@/assets/backgrounds/hero/hero-background-02.png";
import heroBackground03 from "@/assets/backgrounds/hero/hero-background-03.png";

const IdeaToBusiness = () => {
  const { price, testimonials } = ideaToBusiness;
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
  const problems = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "יש לכם רעיון, אבל אין כיוון ברור",
      description:
        "למי בדיוק זה מתאים? מה כדאי למכור? ואיך מסבירים למה לבחור בכם?",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
      title: "עוד שיחה עם ChatGPT. עוד גרסה שנשמרת",
      description:
        "הרבה רעיונות וחומר, אבל ההחלטות על המוצר וההצעה עדיין מחכות.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "רוצים להתקדם למשהו שאפשר להציג",
      description:
        "מוצר ברור, הצעה שאפשר להסביר ודף שאפשר לשלוח לאנשים ולקבל עליו משוב.",
    },
  ];

  const solutions = [
    "כיוון עסקי ברור יותר: נישה, מחקר שוק והבנת הקהל שלכם",
    "שפה וזהות לעסק: ניסוחים, צבעים וסגנון שמרגישים שלכם",
    "מפת מוצרים ומוצר אחד שבחרתם לפתח",
    "הצעה עסקית ברורה: למי היא מתאימה ומה מקבלים",
    "דף נחיתה חי למוצר שלכם, שנבנה בעזרת AI",
  ];

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

  const curriculum = [
    {
      title: "יסודות העסק",
      duration: "כיוון וזהות",
      color: "blue",
      topics: [
        "זיהוי נישה, מחקר שוק והיכרות מעמיקה עם קהל היעד",
        "חידוד השפה, הייחודיות וטון הדיבור של העסק",
        "גיבוש כיוון חזותי: צבעים, פונטים וסגנון",
      ],
    },
    {
      title: "מוצרים והצעה",
      duration: "מוצר מוגדר",
      color: "green",
      topics: [
        "יצירת מפת מוצרים ובחירת מוצר אחד לפיתוח",
        "הגדרת המוצר: למי הוא מתאים ומה הוא כולל",
        "חידוד ההצעה והסיבה לבחור בה",
      ],
    },
    {
      title: "בניית דף נחיתה",
      duration: "דף משלכם",
      color: "purple",
      topics: [
        "הפיכת המחקר וההצעה לבריף מסודר",
        "כתיבת הטקסט וגיבוש העיצוב בעזרת AI",
        "בניית דף חי שאפשר לפרסם ולהציג לקהל",
      ],
    },
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
      title: "תמיכה וגישה גם בהמשך",
      items: [
        "קבוצת WhatsApp לתמיכה במהלך הלמידה והיישום",
        "גישה לכל החיים לתוכן הקורס",
        "עדכונים שיתווספו לקורס",
      ],
    },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"
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
        <a href="#curriculum">לתוכנית הקורס</a>
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

        {/* Floating AI elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-40 right-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-32 left-32 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-3 mb-6">
              <Star className="h-5 w-5 text-yellow-400 ml-2" />
              <span className="text-yellow-400 font-semibold">
                קורס מוקלט עם אבי פריד
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 mb-6 leading-tight"
          >
            מרעיון לעסק
            <br />
            בונים מוצר, הצעה
            <br />
            ודף נחיתה עם AI
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6 drop-shadow-lg"
          >
            הרעיון שלכם מקבל צורה.
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            מכיוון עסקי, דרך מוצר והצעה ברורים, ועד לדף חי שאפשר להתחיל להציג
            לקהל.
            <br />
            <span className="text-yellow-300 font-semibold">
              קורס מעשי בעברית, ללא צורך בניסיון בכתיבת קוד
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6"
          >
            <Button
              asChild={!checkoutLoading}
              disabled={checkoutLoading}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg md:text-2xl px-6 md:px-16 py-8 h-auto md:h-11 whitespace-normal max-w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {checkoutLoading ? 'טוען אפשרות רכישה...' : (
                <a href={checkoutUrl || '#enroll'} onClick={checkoutUrl ? purchaseClick : undefined}>אני רוצה להתחיל לבנות את הרעיון שלי</a>
              )}
            </Button>

            <div className="flex flex-wrap gap-x-6 gap-y-3 items-center justify-center text-gray-300">
              <div className="flex items-center">
                <Users className="h-5 w-5 ml-2" />
                <span>קבוצת WhatsApp לתמיכה</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 ml-2" />
                <span>לומדים בקצב שלכם</span>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-gray-400"
            >
              <a
                href="#course-problem"
                className="text-sm mb-2 hover:underline underline-offset-4"
              >
                גלו עוד
              </a>
              <ChevronDown className="h-6 w-6" />
            </motion.div>
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
            הרעיון שם. גם הרצון. אז למה זה עדיין לא קורה?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300"
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
                    {problem.icon}
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-lg text-blue-900 font-medium">
              כשכל החלטה תלויה בהחלטה אחרת, קשה לדעת מאיפה להתחיל. בקורס עובדים
              לפי סדר: מכירים את הקהל, מחדדים את המוצר וההצעה, ובונים להם דף.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 via-purple-900 to-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBackground03})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-40 h-40 border border-yellow-400/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-60 h-60 border border-blue-400/20 rounded-full"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
          >
            עם מה יוצאים מהקורס?
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xl text-center text-gray-200 mb-12 font-medium"
            >
              חמישה תוצרים שתבנו על הרעיון או העסק שלכם, שלב אחר שלב:
            </motion.p>

            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-center space-x-4 space-x-reverse bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="h-8 w-8 text-green-400 flex-shrink-0" />
                  </motion.div>
                  <span className="text-lg text-white font-medium">
                    {solution}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-red-50/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Suitable For */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200/50">
                <h3 className="text-2xl font-bold text-green-600 mb-8 text-center flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 ml-3" />
                  למי זה מתאים
                </h3>
                <div className="space-y-4">
                  {suitableFor.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-green-50/50 transition-colors"
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200/50">
                <h3 className="text-2xl font-bold text-red-600 mb-8 text-center flex items-center justify-center">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-red-500 flex items-center justify-center ml-3">
                    <span className="text-white text-lg">✕</span>
                  </div>
                  למי זה לא מתאים
                </h3>
                <div className="space-y-4">
                  {notSuitableFor.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-50/50 transition-colors"
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

      {/* Curriculum Timeline */}
      <section
        id="curriculum"
        className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
          >
            תוכנית הקורס
          </motion.h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {curriculum.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative p-8 rounded-2xl bg-white/10 backdrop-blur-sm shadow-2xl border-2 hover:bg-white/20 transition-all duration-300 ${
                  section.color === "blue"
                    ? "border-blue-400 hover:border-blue-300"
                    : section.color === "green"
                      ? "border-green-400 hover:border-green-300"
                      : "border-purple-400 hover:border-purple-300"
                }`}
              >
                <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                  <h3
                    className={`text-2xl font-bold ${
                      section.color === "blue"
                        ? "text-blue-300"
                        : section.color === "green"
                          ? "text-green-300"
                          : "text-purple-300"
                    }`}
                  >
                    חלק {index + 1}: {section.title}
                  </h3>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      section.color === "blue"
                        ? "bg-blue-500/20 text-blue-200 border border-blue-400/30"
                        : section.color === "green"
                          ? "bg-green-500/20 text-green-200 border border-green-400/30"
                          : "bg-purple-500/20 text-purple-200 border border-purple-400/30"
                    }`}
                  >
                    {section.duration}
                  </span>
                </div>

                <ul className="space-y-3">
                  {section.topics.map((topic, topicIndex) => (
                    <li
                      key={topicIndex}
                      className="flex items-center space-x-3 space-x-reverse"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          section.color === "blue"
                            ? "bg-blue-500"
                            : section.color === "green"
                              ? "bg-green-500"
                              : "bg-purple-500"
                        }`}
                      ></div>
                      <span className="text-gray-200 font-medium">{topic}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            מה תקבלו
          </motion.h2>

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

      {(testimonials.length > 0 || preview) && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
              במילים של המשתתפים
            </h2>
            {!testimonials.length && (
              <p className="text-center text-gray-600 mb-8">
                תצוגה מקדימה בלבד: מקום לצילומי WhatsApp שתוסיף. האזור יוסתר
                בפרסום כל עוד הוא ריק.
              </p>
            )}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {testimonials.length
                ? testimonials.map((item) => (
                    <figure
                      key={item.src}
                      className="bg-white/80 p-4 rounded-2xl shadow-xl border border-gray-200/50"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-auto rounded-xl"
                        loading="lazy"
                      />
                    </figure>
                  ))
                : [1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-64 flex items-center justify-center bg-white/80 rounded-2xl border-2 border-dashed border-blue-200 text-blue-800"
                    >
                      מקום לצילום מסך {n}
                    </div>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section
        id="enroll"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            מרעיון לעסק עם AI
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white mb-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-yellow-400 ml-3" />
                <span className="text-xl font-semibold">
                  כל הקורס, בקצב שלכם
                </span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
                  <span
                    dir="ltr"
                    className="text-5xl font-bold text-yellow-400"
                  >
                    ₪{price}
                  </span>
                </div>
                <p className="text-lg mb-4">תשלום חד־פעמי · כולל מע״מ</p>
                {checkoutUrl && !checkoutLoading ? (
                  <Button
                    asChild
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-8 py-6 h-auto whitespace-normal max-w-full rounded-lg"
                  >
                    <a href={checkoutUrl} onClick={purchaseClick}>
                      לרכישת הקורס
                    </a>
                  </Button>
                ) : (
                  <Button
                    disabled
                    aria-describedby="price-checkout-pending"
                    className="bg-yellow-500 text-black font-bold text-lg px-8 py-6 h-auto rounded-lg"
                  >
                    לרכישת הקורס
                  </Button>
                )}
                {!checkoutUrl && !checkoutLoading && (
                  <p id="price-checkout-pending" className="text-sm mt-3">
                    {preview
                      ? "הכפתור ממתין לקישור התשלום שלך."
                      : "ההרשמה אינה זמינה כרגע."}
                  </p>
                )}
                <p className="text-sm mt-4">
                  לאחר השלמת התשלום וההרשמה תקבלו גישה לקורס.
                </p>
              </div>

              {/* Sparkle effect */}
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-yellow-300 text-2xl"
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl border-2 border-green-300 shadow-lg"
            >
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-600 ml-2" />
                <h3 className="text-lg font-bold text-green-800">
                  מה צריך כדי להתחיל?
                </h3>
              </div>
              <p className="text-green-700">
                ידע בסיסי במחשב ובדפדפן, חשבון ChatGPT (אפשר להתחיל בחינם), מסמך
                Google Docs ריק ורעיון או עסק שתרצו לעבוד עליו.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-950 via-purple-900 to-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBackground01})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/80 to-slate-900/70"></div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
              className={`absolute w-2 h-2 bg-yellow-400 rounded-full blur-sm`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

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
            אתם לא צריכים לפתור היום את כל העסק. תתחילו מהצעד שיהפוך את הרעיון
            שלכם לקצת יותר ברור, עד למוצר, להצעה ולדף שאפשר להציג.
          </motion.p>

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

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-yellow-400 mt-6 font-medium"
          >
            גישה לכל החיים · עדכוני קורס · קבוצת WhatsApp לתמיכה
          </motion.p>
        </div>
      </section>
    </main>
  );
};

export default IdeaToBusiness;
