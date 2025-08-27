import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section className="py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            {/* Yellow Accent Frame */}
            <div className="relative p-1 bg-gradient-to-r from-[#eec643] via-[#eec643]/80 to-[#eec643] rounded-2xl">
              <div className="relative bg-[#101933] rounded-xl overflow-hidden">
                <div className="relative w-full aspect-square">
                  {/* Placeholder for professional image - replace with actual image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#eec643]/20 to-[#101933] flex items-center justify-center rounded-xl">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-[#eec643]/20 rounded-full mb-4 mx-auto flex items-center justify-center border border-[#eec643]/30">
                        <svg className="w-12 h-12 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-[#eec643] font-semibold">תמונה מקצועית של אבי פריד</p>
                      <p className="text-gray-400 text-sm mt-2">להחליף בתמונה אמיתית</p>
                    </div>
                  </div>
                  {/* Future: Replace with actual image 
                  <img
                    src="/path-to-avi-fried-photo.jpg"
                    alt="אבי פריד - AI Master"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  */}
                </div>
              </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/20 via-transparent to-[#eec643]/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6 order-1 lg:order-2"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#eec643] leading-tight hebrew-mobile-wrap">
              אני לא מלמד טכנולוגיה. אני מלמד איך לחשוב מחדש על פוטנציאל.
            </h2>
            
            <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed hebrew-mobile-wrap">
              התשוקה שלי היא לא AI. התשוקה שלי היא פוטנציאל אנושי. אני מגיע מעולמות של שיווק, פיתוח עסקי ויצירתיות, ולמדתי על בשרי איך לתרגם את המורכבות של AI לשפה פשוטה, מעשית ומעוררת השראה. אני יודע איך זה מרגיש לעמוד מול הר של מושגים לא ברורים, והפכתי את זה למשימת חיי לבנות את הגשר הבטוח והברור ביותר אל העתיד, עבור אנשים כמוך וכמוני.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;