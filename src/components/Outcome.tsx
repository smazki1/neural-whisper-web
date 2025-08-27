import React from 'react';
import { motion } from 'framer-motion';

const Outcome = () => {
  const tracks = [
    {
      title: "לבעלי עסקים ויזמים",
      result: "התוצאה: הופכים את העסק למכונה אוטונומית של צמיחה.",
      path: "הדרך: נלמד איך להשתמש ב-AI כדי לזקק אסטרטגיה מנצחת, לבנות שיווק שמייצר לקוחות באופן קבוע, ולפתח מוצרים שהשוק לא יכול להתעלם מהם. נפסיק לרדוף אחרי הזנב של עצמנו ונתחיל לבנות נכסים שעובדים בשבילנו.",
      icon: (
        <svg className="w-12 h-12 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "למחפשי הזדמנות ושינוי קריירה",
      result: "התוצאה: הופכים לאנשי מקצוע שאי אפשר להחליף.",
      path: "הדרך: נלמד איך לרכוש מיומנויות פרקטיות ומבוקשות שהופכות אותך לנכס בכל ארגון. במקום לפחד שהטכנולוגיה תחליף אותך, תלמד איך לרתום אותה כדי להפוך למומחה בתחומך, לשפר את הביטחון העצמי ולהגדיל משמעותית את הפוטנציאל הכלכלי שלך.",
      icon: (
        <svg className="w-12 h-12 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "ליוצרים, אנשי רוח ומחפשי צמיחה אישית",
      result: "התוצאה: הופכים רעיונות תקועים ליצירות מוחשיות.",
      path: "הדרך: נלמד איך להשתמש ב-AI כשותף יצירתי. נשבור מחסומים, נפתח רעיונות, נכתוב את הספר שתמיד רצית, נבנה את הפרויקט שחלמת עליו ונהפוך את הניצוץ הפנימי שלך למשהו שאפשר לראות, לגעת ולהרגיש.",
      icon: (
        <svg className="w-12 h-12 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight px-2 hebrew-mobile-wrap">
            <span className="text-[#eec643] font-bold">שיטות לימוד שיעזרו לכל מי שרוצה לבנות את העתיד שלו, לא לחכות לו.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="premium-card p-6 md:p-8 relative group hover:scale-[1.02] transition-all duration-300"
            >
              {/* Premium Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#eec643]/10 via-transparent to-[#eec643]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-[#eec643]/10 rounded-full border border-[#eec643]/20 flex justify-center">
                  {track.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#eec643] mb-4 leading-snug hebrew-mobile-wrap">
                  {track.title}
                </h3>
                <div className="mb-4 p-4 bg-[#eec643]/5 rounded-lg border border-[#eec643]/10">
                  <p className="text-sm md:text-base font-semibold text-[#eec643] hebrew-mobile-wrap">
                    {track.result}
                  </p>
                </div>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed hebrew-mobile-wrap">
                  {track.path}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Outcome;