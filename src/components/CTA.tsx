import React from 'react';
import { motion } from 'framer-motion';

interface CTAProps {
  onContactClick?: () => void;
}

const CTA: React.FC<CTAProps> = ({ onContactClick }) => {
  return (
    <section id="offers" className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0d1528] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#eec643]/10 to-transparent rounded-full blur-3xl animate-premium-float"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-12 leading-tight px-2 hebrew-mobile-wrap"
          >
            <span className="text-[#eec643] font-bold">מוכנים להתחיל?</span>{' '}
            שלא נבזבז זמן.
          </motion.h2>

          {/* Action buttons container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-center items-center mb-8 md:mb-12"
          >
            {/* First CTA Button */}
            <motion.button 
              onClick={onContactClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="premium-button-primary premium-glow text-base md:text-lg lg:text-xl px-6 md:px-8 py-3 md:py-4 group w-full lg:w-auto min-w-[280px] md:min-w-[300px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3 hebrew-mobile-wrap">
                למד אותי לחשוב עם AI
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </span>
            </motion.button>

            {/* Second CTA Button */}
            <motion.button 
              onClick={onContactClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="premium-button-secondary text-base md:text-lg lg:text-xl px-6 md:px-8 py-3 md:py-4 group w-full lg:w-auto min-w-[280px] md:min-w-[300px] border-2 border-[#eec643] text-[#eec643] hover:bg-[#eec643] hover:text-[#101933] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3 hebrew-mobile-wrap">
                למד את הצוות שלי לחשוב עם AI
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </span>
            </motion.button>
          </motion.div>

          {/* Description moved after buttons */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed mb-12 md:mb-16 px-2 hebrew-mobile-wrap"
          >
            בין אם אתם יזמים עם מחברת מלאה ברעיונות, ובין אם אתם אנשי מקצוע שרוצים להפוך את המהפכה הזו להזדמנות שלכם – יש לנו את המסלול המדויק עבורכם.
          </motion.p>

          {/* Contact section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16"
          >
            <div className="glassmorphism-dark rounded-2xl p-6 md:p-8 border border-[#eec643]/20">
              <p className="text-lg md:text-xl text-gray-300 mb-4 md:mb-6 hebrew-mobile-wrap">
                יש לכם שאלות? רוצים לדעת יותר?
              </p>
              <button 
                onClick={onContactClick}
                className="premium-button-secondary text-base md:text-lg px-5 md:px-6 py-2 md:py-3 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  צור קשר
                  <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;