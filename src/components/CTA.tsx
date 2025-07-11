import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-20 bg-brand-primary font-heebo" dir="rtl">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-brand-text mb-8 leading-tight">
            מוכן להתחיל את המסע?
          </h2>
          
          <p className="text-xl md:text-2xl text-brand-text/90 mb-12 leading-relaxed">
            בחר את הדרך שמתאימה לך ותתחיל להפוך רעיונות למציאות
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-brand-accent text-brand-primary font-bold text-lg md:text-xl rounded-lg hover:bg-brand-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-accent/25 min-w-[280px]"
            >
              לסדנאות יצירה ופיתוח
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-brand-accent text-brand-accent font-bold text-lg md:text-xl rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 min-w-[280px]"
            >
              פתרונות AI לארגונים וצוותים
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-brand-text/70 text-lg">
              יש לך שאלות? רוצה להבין יותר על התהליך?
            </p>
            <button className="mt-4 text-brand-accent hover:text-brand-accent/80 font-semibold text-lg underline transition-colors duration-200">
              בוא נדבר - ללא התחייבות
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;