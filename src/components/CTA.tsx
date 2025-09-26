import React from 'react';
import { motion } from 'framer-motion';

interface CTAProps {
  onContactClick?: () => void;
}

const CTA: React.FC<CTAProps> = ({ onContactClick }) => {
  return (
    <section id="offers" className="py-16 md:py-20 font-heebo professional-section-bg" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold professional-text-primary mb-8 md:mb-12 leading-tight px-2 hebrew-mobile-wrap"
          >
            <span className="professional-text-accent font-bold">מוכנים להתחיל?</span>{' '}
            שלא נבזבז זמן.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-center items-center mb-8 md:mb-12"
          >
            <motion.button 
              onClick={onContactClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="professional-button-primary text-base md:text-lg px-8 py-4 group w-full lg:w-auto min-w-[280px] md:min-w-[300px]"
            >
              <span className="flex items-center justify-center gap-3 hebrew-mobile-wrap">
                למד אותי לחשוב עם AI
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </span>
            </motion.button>

            <motion.button 
              onClick={onContactClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="professional-button-secondary text-base md:text-lg px-8 py-4 group w-full lg:w-auto min-w-[280px] md:min-w-[300px]"
            >
              <span className="flex items-center justify-center gap-3 hebrew-mobile-wrap">
                למד את הצוות שלי לחשוב עם AI
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </span>
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl professional-text-body leading-relaxed mb-12 px-2 hebrew-mobile-wrap"
          >
            בין אם אתם יזמים עם מחברת מלאה ברעיונות, ובין אם אתם אנשי מקצוע שרוצים להפוך את המהפכה הזו להזדמנות שלכם – יש לנו את המסלול המדויק עבורכם.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16"
          >
            <div className="professional-card p-6 md:p-8">
              <p className="text-lg md:text-xl professional-text-body mb-6 hebrew-mobile-wrap">
                יש לכם שאלות? רוצים לדעת יותר?
              </p>
              <button 
                onClick={onContactClick}
                className="professional-button-secondary text-base md:text-lg px-6 py-3 group"
              >
                <span className="flex items-center justify-center gap-2">
                  צור קשר
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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