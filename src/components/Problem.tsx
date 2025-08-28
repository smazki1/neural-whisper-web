import React from 'react';
import { motion } from 'framer-motion';

const Problem = () => {
  return (
    <section className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="premium-card p-6 md:p-8 lg:p-12 relative group"
        >
          {/* Premium Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/10 via-transparent to-[#eec643]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-8 leading-tight hebrew-mobile-wrap">
              העולם דוהר קדימה. אם הרגשת את אחד מאלה, אתה לא לבד:
            </h2>
            
            <div className="grid gap-6 md:gap-8 max-w-4xl mx-auto">
              <div className="flex items-start gap-4 p-6 premium-card">
                <div className="flex-shrink-0 w-12 h-12 bg-[#eec643]/10 rounded-full flex items-center justify-center border border-[#eec643]/20">
                  <svg className="w-6 h-6 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#eec643] mb-2 hebrew-mobile-wrap">הפחד להישאר מאחור</h3>
                  <p className="text-gray-300 leading-relaxed hebrew-mobile-wrap">
                    תחושת הדחיפות הזו, לראות את כולם מתקדמים ולהרגיש שאתה עלול לפספס את הרכבת.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 premium-card">
                <div className="flex-shrink-0 w-12 h-12 bg-[#eec643]/10 rounded-full flex items-center justify-center border border-[#eec643]/20">
                  <svg className="w-6 h-6 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#eec643] mb-2 hebrew-mobile-wrap">הצפת המידע</h3>
                  <p className="text-gray-300 leading-relaxed hebrew-mobile-wrap">
                    אינסוף כלים, חדשות ומושגים מורכבים שגורמים ל-AI להיראות כמו משימה בלתי אפשרית.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 premium-card">
                <div className="flex-shrink-0 w-12 h-12 bg-[#eec643]/10 rounded-full flex items-center justify-center border border-[#eec643]/20">
                  <svg className="w-6 h-6 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#eec643] mb-2 hebrew-mobile-wrap">פער בין רעיון למציאות</h3>
                  <p className="text-gray-300 leading-relaxed hebrew-mobile-wrap">
                    ההרגשה שיש לך רעיונות גדולים, אבל חסר לך הגשר לתרגם אותם לתוצאות ממשיות בעולם החדש.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 premium-card">
                <div className="flex-shrink-0 w-12 h-12 bg-[#eec643]/10 rounded-full flex items-center justify-center border border-[#eec643]/20">
                  <svg className="w-6 h-6 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#eec643] mb-2 hebrew-mobile-wrap">הקול שאומר "זה לא בשבילי"</h3>
                  <p className="text-gray-300 leading-relaxed hebrew-mobile-wrap">
                    "אני לא טכנולוג", "טכנולוגיה זה מסובך", "אני כבר מבוגר מדי בשביל זה".
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;