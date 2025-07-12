import React from 'react';
import { motion } from 'framer-motion';

const Outcome = () => {
  const benefits = [
    {
      title: "לשחרר את הפקק המחשבתי",
      text: "קבלו שיטה ברורה שהופכת את הצפת הרעיונות שלכם לתוכנית פעולה ממוקדת.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      delay: 0.1
    },
    {
      title: "לגלות את הקול הייחודי שלכם",
      text: "למדו להטמיע את ה-DNA שלכם ב-AI, ולקבל עוזר אישי שבאמת מבין את הראש שלכם.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7v5m0 3h.01" />
        </svg>
      ),
      delay: 0.2
    },
    {
      title: "לקבל שותף יצירתי 24/7",
      text: "דמיינו עוזר אישי, יועץ אסטרטגי ואיש קריאייטיב שעובד עבורכם מסביב לשעון.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v2z" />
        </svg>
      ),
      delay: 0.3
    },
    {
      title: "להוביל את השינוי, לא לרדוף אחריו",
      text: "ציידו את עצמכם בידע ובכלים שהופכים אתכם למובילים בתחומכם, בזמן שאחרים עדיין תקועים מאחור.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      delay: 0.4
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
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold premium-text-gradient mb-6 md:mb-8 leading-tight px-2">
            <span className="text-brand-accent">כאן תגלו איך להפוך את המכונה</span>{' '}
            לשותף יצירתי אמיתי
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
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
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-brand-accent/10 rounded-full border border-[#eec643]/20">
                  {benefit.icon}
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-accent mb-3 md:mb-4 leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-base md:text-lg text-brand-text/90 leading-relaxed text-center">
                  {benefit.text}
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