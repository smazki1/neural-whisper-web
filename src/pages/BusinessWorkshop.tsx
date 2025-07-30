import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Users, Trophy, Zap, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BusinessWorkshop = () => {
  const problems = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "אתם רואים שכל העולם מדבר על AI",
      description: "אבל לא יודעים איך זה באמת יכול לעזור לעסק שלכם?"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
      title: "מרגישים שאתם מפספסים משהו גדול",
      description: "אבל המידע מבלבל ונשמע מסובך מדי?"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "הגיע הזמן לשנות את זה",
      description: "AI לא יחליף אתכם - אבל מי שיודע להשתמש בו נכון יחליף את מי שלא יודע"
    }
  ];

  const solutions = [
    "יצירת תוכן שיווקי שמושך לקוחות כמו מגנט",
    "כתיבת מיילים ופוסטים ברמה מקצועית תוך דקות",
    "מחקר מתחרים וניתוח שוק בצורה חכמה ומהירה",
    "פיתוח רעיונות יצירתיים לשיפור העסק",
    "אוטומציה של משימות חוזרות שגוזלות זמן יקר"
  ];

  const suitableFor = [
    "בעלי עסקים קטנים ובינוניים",
    "יזמים בתחילת דרכם", 
    "מי שמעולם לא השתמש ב-AI או השתמש בצורה בסיסית",
    "מי שרוצה תוצאות מהירות ללא סיבוכים טכניים"
  ];

  const notSuitableFor = [
    "מי שכבר משתמש ב-AI באופן יומיומי ומחפש טכניקות מתקדמות",
    "מי שמעדיף לימוד תיאורטי על פני יישום מעשי",
    "מי שלא מוכן להקדיש 30 דקות ביום לתרגול אחרי הסדנה"
  ];

  const curriculum = [
    {
      title: "הכרה וביטחון",
      duration: "45 דקות",
      color: "blue",
      topics: [
        "מהו AI ולמה זה חשוב לעסק שלי?",
        "הכרת ChatGPT והגדרת החשבון",
        "הפרומפט הראשון שלכם - תוצאות מרשימות מיד"
      ]
    },
    {
      title: "כלים לשיווק ותוכן",
      duration: "90 דקות",
      color: "green",
      topics: [
        "יצירת פוסטים לרשתות חברתיות",
        "כתיבת מיילים שממירים",
        "פיתוח רעיונות לקמפיינים",
        "תרגול מעשי על העסק שלכם"
      ]
    },
    {
      title: "יישום וצעדים הבאים",
      duration: "45 דקות",
      color: "purple",
      topics: [
        "בניית תוכנית עבודה חודשית עם AI",
        "טיפים למיקסום התוצאות",
        "מקורות המשך ללמידה עצמית"
      ]
    }
  ];

  const bonuses = [
    {
      title: "ערכת כלים מוכנה לשימוש",
      items: [
        "בנק של 50 פרומפטים מוכנים לעסקים",
        "תבניות ליצירת תוכן שיווקי",
        "הקלטה של הסדנה לצפייה חוזרת"
      ]
    },
    {
      title: "בונוס מיוחד",
      items: [
        "גישה לקבוצת ווטסאפ סגורה לשאלות והכוונה",
        "מדריך PDF: יצירת צבא של סוכני AI בתור עוזרים אישיים בעסק שלכם"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-blue-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6"
          >
            הפכו את ChatGPT לעוזר העסקי החכם ביותר שלכם
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4"
          >
            ב-3 שעות בלבד!
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white mb-8 max-w-4xl mx-auto"
          >
            סדנה מעשית לבעלי עסקים שרוצים להתחיל להשתמש בבינה מלאכותית כבר היום - ללא ידע טכני מוקדם
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl px-12 py-6 rounded-lg">
              הירשמו עכשיו - מקומות מוגבלים
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16"
          >
            בעיה והזדמנות
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center p-6 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-center mb-4">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  {problem.title}
                </h3>
                <p className="text-gray-700">
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
              בעולם העסקי של היום, AI לא יחליף אתכם - אבל מי שיודע להשתמש בו נכון יחליף את מי שלא יודע.
              הסדנה הזו נועדה לקחת אתכם מאפס לידע מעשי ב-3 שעות ממוקדות.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16"
          >
            מה תלמדו
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xl text-center text-blue-900 mb-12 font-medium"
            >
              ב-3 שעות תלמדו לרתום את ChatGPT עבור:
            </motion.p>
            
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-center space-x-4 space-x-reverse bg-white p-4 rounded-lg shadow-sm"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg text-gray-800">{solution}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Suitable For */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-green-600 mb-8 text-center">למי זה מתאים</h3>
              <div className="space-y-4">
                {suitableFor.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Not Suitable For */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-red-600 mb-8 text-center">למי זה לא מתאים</h3>
              <div className="space-y-4">
                {notSuitableFor.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 space-x-reverse">
                    <div className="h-5 w-5 flex-shrink-0 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs">✕</span>
                    </div>
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16"
          >
            מבנה הסדנה
          </motion.h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {curriculum.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative p-8 rounded-lg bg-white shadow-lg border-r-4 ${
                  section.color === 'blue' ? 'border-blue-500' :
                  section.color === 'green' ? 'border-green-500' :
                  'border-purple-500'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-2xl font-bold ${
                    section.color === 'blue' ? 'text-blue-600' :
                    section.color === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  }`}>
                    חלק {index + 1}: {section.title}
                  </h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    section.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    section.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {section.duration}
                  </span>
                </div>
                
                <ul className="space-y-3">
                  {section.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center space-x-3 space-x-reverse">
                      <div className={`h-2 w-2 rounded-full ${
                        section.color === 'blue' ? 'bg-blue-500' :
                        section.color === 'green' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}></div>
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
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
                className="bg-gray-800 p-8 rounded-lg border border-yellow-400"
              >
                <div className="flex items-center mb-6">
                  <Trophy className="h-8 w-8 text-yellow-400 ml-3" />
                  <h3 className="text-xl font-bold text-yellow-400">{bonus.title}</h3>
                </div>
                
                <ul className="space-y-3">
                  {bonus.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-3 space-x-reverse">
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

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16"
          >
            השקעה
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white mb-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-yellow-400 ml-3" />
                <span className="text-xl font-semibold">מחיר מיוחד לרישום מוקדם</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
                  <span className="text-3xl line-through text-gray-300">₪897</span>
                  <span className="text-5xl font-bold text-yellow-400">₪497</span>
                </div>
                <p className="text-lg mb-4">מוגבל ל-15 משתתפים ראשונים</p>
              </div>
            </div>
            
            <div className="bg-green-100 p-6 rounded-lg border border-green-300">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-600 ml-2" />
                <h3 className="text-lg font-bold text-green-800">אחריות מלאה</h3>
              </div>
              <p className="text-green-700">
                30 יום אחריות מלאה - אם לא תרגישו שקיבלתם ערך של לפחות פי 10 מההשקעה, תקבלו החזר כספי מלא
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-800 to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8"
          >
            הזדמנות זהב לשנות את העסק שלכם
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white mb-8 max-w-3xl mx-auto"
          >
            בעוד 3 שעות תדעו להשתמש ב-AI בצורה שתחסוך לכם שעות עבודה כל יום ותיתן לכם יתרון על המתחרים
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-2xl px-16 py-8 rounded-lg">
              להרשמה מיידית - לחצו כאן
            </Button>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-yellow-400 mt-6 font-medium"
          >
            * נותרו מקומות ספורים בלבד
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default BusinessWorkshop;