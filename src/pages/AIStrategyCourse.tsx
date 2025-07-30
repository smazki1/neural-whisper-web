import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, TrendingUp, Users, Lightbulb, BarChart3, 
  Zap, Brain, Rocket, CheckCircle, Star,
  Calendar, Clock, Award, Trophy, Shield,
  ArrowRight, Sparkles, Diamond, Crown,
  Map, Megaphone, Settings, DollarSign,
  ChevronDown, ChevronUp, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/backgrounds/hero/hero-background-15.png';

const AIStrategyCourse = () => {
  const [expandedSession, setExpandedSession] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/50 to-purple-950/30" />
        
        {/* Neural Network Background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gold-400 via-yellow-300 to-gold-500 bg-clip-text text-transparent"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(251, 191, 36, 0.5)",
                  "0 0 40px rgba(251, 191, 36, 0.8)",
                  "0 0 20px rgba(251, 191, 36, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI Strategist
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              קורס אסטרטגי ב-<span className="text-gold-400 font-bold">3 מפגשים</span> לבעלי עסקים 
              שרוצים לבנות יתרון תחרותי בר-קיימא עם בינה מלאכותית
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Crown className="mr-2 h-5 w-5" />
                הפכו לאסטרטגים
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem & Opportunity Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
              מהכלים לאסטרטגיה מנצחת
            </h2>
            
            <div className="text-right text-lg leading-relaxed text-gray-300 space-y-6">
              <p>"אתם כבר מכירים את החלק הטכני של AI, אבל השאלה האמיתית היא:</p>
              
              <div className="grid md:grid-cols-2 gap-6 my-12">
                {[
                  "איך הופכים AI מכלי לאסטרטגיה עסקית מנצחת?",
                  "איך עוברים מ'יצירת פוסטים מהירה' ל'בניית מותג דומיננטי'?",
                  "איך הופכים נתונים לתובנות אסטרטגיות שמובילות לצמיחה?",
                  "איך מבנים מערכת שמזהה הזדמנויות עסקיות לפני המתחרים?"
                ].map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-blue-950/30 border border-blue-700/50 rounded-lg p-6 text-right"
                  >
                    <p className="text-blue-200">{question}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-8 my-8">
                <p className="text-xl text-gold-300 font-semibold">
                  זה לא רק שימוש ב-AI - זה חשיבה עסקית מונעת AI.
                </p>
                <p className="mt-4 text-gray-300">
                  הקורס הזה לוקח בעלי עסקים עם יסודות טכניים ומעביר אותם לרמה של 
                  <span className="text-gold-400 font-bold"> AI Business Strategists </span>
                  שמובילים שווקים."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Sessions */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            תכנית הקורס - 3 מפגשים אסטרטגיים
          </motion.h2>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                id: 1,
                title: "אסטרטגיית שוק ומיקום תחרותי",
                subtitle: "מכירים את הכלים - עכשיו נלמד לחשוב איתם אסטרטגית",
                duration: "3 שעות",
                color: "from-blue-600 to-blue-800",
                icon: <Map className="h-8 w-8" />,
                topics: [
                  {
                    title: "ניתוח נישה עסקית מתקדם:",
                    items: [
                      "זיהוי הזדמנויות עסקיות נסתרות עם AI",
                      "מיפוי פערים בשוק שהמתחרים לא רואים",
                      "בניית מטריקס הזדמנויות מבוסס נתונים"
                    ]
                  },
                  {
                    title: "חקר קהל יעד עמוק:",
                    items: [
                      "יצירת פרסונות לקוח רב-ממדיות עם AI",
                      "זיהוי צרכים לא מודעים וכאבים נסתרים",
                      "מיפוי מסע הלקוח ונקודות חיכוך קריטיות"
                    ]
                  },
                  {
                    title: "זיהוי טרנדים ומגמות עתידיות:",
                    items: [
                      "שימוש בכלים לניטור וחיזוי מגמות",
                      "מיקום העסק בחזית החדשנות",
                      "בניית יתרון תחרותי ארוך טווח"
                    ]
                  }
                ],
                output: "מפת אסטרטגיה עסקית מלאה + דוח הזדמנויות אישי"
              },
              {
                id: 2,
                title: "מיתוג ומסרים אסטרטגיים",
                subtitle: "לא רק תוכן - אלא זהות מותג שמקסמת השפעה",
                duration: "3 שעות",
                color: "from-purple-600 to-purple-800",
                icon: <Megaphone className="h-8 w-8" />,
                topics: [
                  {
                    title: "פיתוח קול מותג ייחודי:",
                    items: [
                      "בניית DNA מותג עם AI",
                      "התאמה לערכי העסק וקהל היעד",
                      "יצירת עקביות בכל נקודות המגע"
                    ]
                  },
                  {
                    title: "אסטרטגיית מסרים מתקדמת:",
                    items: [
                      "פיתוח היררכיית מסרים לקהלים שונים",
                      "יצירת מסרים שיווקיים שמניעים לפעולה",
                      "בדיקה ואופטימיזציה של מסרים בזמן אמת"
                    ]
                  },
                  {
                    title: "יצירת הצעות ערך חדשניות:",
                    items: [
                      "מתודולוגיות לפיתוח הצעות מכירה מנצחות",
                      "התאמה דינמית לצרכים משתנים של לקוחות",
                      "בניית מערכת הצעות מותאמות אישית"
                    ]
                  }
                ],
                output: "מדריך מותג מלא + בנק מסרים לכל מצב + 3 הצעות ערך מותאמות"
              },
              {
                id: 3,
                title: "מערכות שיווק ואופטימיזציה",
                subtitle: "מתוכן ליצירת מערכות שיווק אוטומטיות ואינטליגנטיות",
                duration: "3 שעות",
                color: "from-gold-600 to-yellow-600",
                icon: <Settings className="h-8 w-8" />,
                topics: [
                  {
                    title: "יצירת תוכן שיווקי מערכתי:",
                    items: [
                      'בניית "מפעל תוכן" חכם לכל פלטפורמה',
                      "אסטרטגיות תוכן שמניעות engagement ומכירות",
                      "יצירת תוכן ויראלי ומשפיע"
                    ]
                  },
                  {
                    title: "אופטימיזציית המרות מתקדמת:",
                    items: [
                      "בניית ריצפי מיילים שמתאימים עצמם ללקוח",
                      "אופטימיזציה של דפי נחיתה עם A/B testing חכם",
                      "יצירת משפכי מכירה אוטומטיים"
                    ]
                  },
                  {
                    title: "מערכות לידים אינטליגנטיות:",
                    items: [
                      "זיהוי וטיפוח לידים איכותיים",
                      "שימוש בחזוי AI לזיהוי לקוחות פוטנציאליים",
                      "בניית קמפיינים שמתאימים עצמם לתוצאות"
                    ]
                  }
                ],
                output: "מערכת שיווק אוטומטית מלאה + מדריך אופטימיזציה + דאשבורד מדידת ROI"
              }
            ].map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: session.id * 0.1 }}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                <div 
                  className={`bg-gradient-to-r ${session.color} p-6 cursor-pointer`}
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="bg-white/20 p-3 rounded-lg">
                        {session.icon}
                      </div>
                      <div className="text-right">
                        <h3 className="text-2xl font-bold text-white">
                          מפגש {session.id}: {session.title}
                        </h3>
                        <p className="text-gray-200 mt-1">{session.subtitle}</p>
                        <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm mt-2">
                          {session.duration}
                        </span>
                      </div>
                    </div>
                    {expandedSession === session.id ? 
                      <ChevronUp className="h-6 w-6 text-white" /> : 
                      <ChevronDown className="h-6 w-6 text-white" />
                    }
                  </div>
                </div>

                {expandedSession === session.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 text-right"
                  >
                    <div className="space-y-6">
                      {session.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="space-y-3">
                          <h4 className="text-lg font-semibold text-gold-400 flex items-center">
                            <Target className="h-5 w-5 ml-2" />
                            {topic.title}
                          </h4>
                          <ul className="space-y-2 pr-6">
                            {topic.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-gray-300 flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-400 ml-2 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      
                      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg p-4 mt-6">
                        <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
                          <Award className="h-5 w-5 ml-2" />
                          פלט המפגש:
                        </h4>
                        <p className="text-gray-300">{session.output}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
            >
              למי זה מתאים?
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-green-900/20 border border-green-500/30 rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-6 text-right">✅ מתאים לכם אם:</h3>
                <ul className="space-y-3 text-right">
                  {[
                    "בעלי עסקים עם בסיס טכני ב-AI שרוצים לעבור לרמה אסטרטגית",
                    "מי שכבר יודע להשתמש ב-ChatGPT ורוצה לבנות מערכות עסקיות",
                    "יזמים שמחפשים לא רק יעילות אלא יתרון תחרותי משמעותי",
                    "מי שמוכן לחשוב על AI כשותף אסטרטגי ולא רק כלי"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 ml-2 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-600 rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold text-gold-400 mb-6 text-right">📋 דרישות מוקדמות:</h3>
                <ul className="space-y-3 text-right">
                  {[
                    "שימוש יומיומי ב-ChatGPT או כלי AI דומה למשך חודש לפחות",
                    "הבנה של מטריקות עסקיות בסיסיות (המרות, ROI, CAC)",
                    "נכונות להקדיש 3-4 שעות בין מפגשים ליישום אסטרטגי"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <Shield className="h-5 w-5 text-blue-400 ml-2 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Deliverables */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            מה תקבלו בקורס
          </motion.h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              {
                title: "אסטרטגיה עסקית מלאה",
                icon: <Rocket className="h-12 w-12" />,
                color: "from-blue-600 to-purple-600",
                items: [
                  "מפת הזדמנויות עסקיות אישית",
                  "מדריך מותג ומסרים שלם",
                  "מערכת שיווק אוטומטית פעילה"
                ]
              },
              {
                title: "כלים ומערכות מתקדמות",
                icon: <Brain className="h-12 w-12" />,
                color: "from-purple-600 to-pink-600",
                items: [
                  "דאשבורד ניהול אסטרטגיה עם AI",
                  "500+ פרומפטים מתקדמים לכל תחום",
                  "תבניות לבניית מערכות עסקיות",
                  "גישה לכלים פרימיום (בשווי ₪1,000)"
                ]
              },
              {
                title: "ליווי והטמעה",
                icon: <Trophy className="h-12 w-12" />,
                color: "from-gold-500 to-yellow-500",
                items: [
                  "3 חודשי ליווי אישי בהטמעה",
                  "6 חודשי גישה לעדכונים וכלים חדשים",
                  "קבוצה סגורה של AI Business Strategists",
                  "זום חודשי לעדכונים וטרנדים"
                ]
              }
            ].map((package_item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className={`bg-gradient-to-r ${package_item.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  {package_item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{package_item.title}</h3>
                <ul className="space-y-2 text-right">
                  {package_item.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 ml-2 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Timeline */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            גלגל ההצלחה - מה קורה אחרי הקורס
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {[
                {
                  month: "חודש 1",
                  title: "יישום האסטרטגיה",
                  description: "ראשוני לתוצאות ברמת שיפור 30-50% ביעילות השיווק",
                  color: "from-blue-500 to-blue-700"
                },
                {
                  month: "חודש 2-3",
                  title: "אופטימיזציה והתאמה",
                  description: "הגעה לשיפור 70-100% במטריקות מפתח",
                  color: "from-purple-500 to-purple-700"
                },
                {
                  month: "חודש 4-6",
                  title: "חדשנות והובלה",
                  description: "הפיכה ל-AI Business Leader בתחום שלכם",
                  color: "from-gold-500 to-yellow-600"
                }
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className={`bg-gradient-to-r ${phase.color} rounded-xl p-6`}>
                      <h3 className="text-2xl font-bold text-white mb-2">📈 {phase.month}</h3>
                      <h4 className="text-xl font-semibold text-gray-100 mb-3">{phase.title}</h4>
                      <p className="text-gray-200">{phase.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-gold-400 rounded-full relative z-10">
                    {index < 2 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-gold-400"></div>
                    )}
                  </div>
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-8"
            >
              <Quote className="h-12 w-12 text-gold-400 mx-auto mb-6" />
              <blockquote className="text-xl md:text-2xl text-gray-300 mb-6 italic text-right">
                "עברתי מלהשתמש ב-ChatGPT לכתיבת פוסטים למערכת שיווק שמזהה הזדמנויות עסקיות 
                לפני שהמתחרים מבינים מה קורה. התוצאה: 180% צמיחה ב-6 חודשים."
              </blockquote>
              <div className="text-right">
                <cite className="text-gold-400 font-semibold">- רונית כהן</cite>
                <p className="text-gray-400">מייסדת סטודיו עיצוב</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            השקעה בעתיד העסק שלכם
          </motion.h2>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gold-900/30 to-yellow-900/30 border-2 border-gold-500/50 rounded-2xl p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-yellow-500/10"></div>
              <div className="relative z-10">
                <Crown className="h-16 w-16 text-gold-400 mx-auto mb-6" />
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Business Mastery</h3>
                
                <div className="mb-8">
                  <div className="text-6xl md:text-7xl font-bold text-gold-400 mb-2">₪3,497</div>
                  <p className="text-gray-300 text-lg">תשלום חד-פעמי</p>
                  <div className="mt-4 text-center">
                    <span className="text-gray-300">או </span>
                    <span className="text-gold-400 font-bold text-xl">3 תשלומים של ₪1,297</span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-6 mb-8 text-right">
                  <h4 className="text-xl font-semibold text-white mb-4">כלול במחיר:</h4>
                  <p className="text-gray-300">
                    כל האסטרטגיות, הכלים, המערכות והליווי למשך 6 חודשים
                  </p>
                </div>

                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600 text-black font-bold text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <DollarSign className="mr-2 h-6 w-6" />
                  הרשמה לקורס
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-black via-blue-950/50 to-purple-950/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gold-400 via-yellow-300 to-gold-500 bg-clip-text text-transparent">
              הגיע הזמן להוביל
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12">
              הפכו ל-AI Business Strategists והובילו את השוק שלכם לעידן החדש
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600 text-black font-bold text-2xl px-16 py-8 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Rocket className="mr-3 h-8 w-8" />
                התחילו את המסע
                <Sparkles className="ml-3 h-8 w-8" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AIStrategyCourse;