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
                  <img
                    src="/lovable-uploads/6471f652-e053-4640-8a34-0f7db2486913.png"
                    alt="אבי פריד - מומחה AI ויזם"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
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
               התשוקה שלי היא לא AI – היא פוטנציאל אנושי. הגעתי מעולמות של שיווק, פיתוח עסקי ויצירתיות, והפכתי למשימת חיי לתרגם את המורכבות של AI לשפה פשוטה, מעשית ומעוררת השראה.
               <br /><br />
               אני יודע איך זה מרגיש לעמוד מול הר של מושגים לא ברורים. תפקידי הוא לבנות עבורך את הגשר הבטוח והברור ביותר אל העתיד.
             </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;