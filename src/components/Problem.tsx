import React from 'react';
import { motion } from 'framer-motion';

const Problem = () => {
  return (
    <section className="py-20 bg-brand-primary font-heebo" dir="rtl">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-brand-surface rounded-xl p-8 md:p-12 shadow-2xl border border-brand-surface/50"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-brand-text mb-8 leading-tight">
            הבעיה היא לא חוסר יצירתיות.{' '}
            <span className="text-brand-accent">הבעיה היא הצפת יצירתיות.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-brand-text/90 leading-relaxed">
            יוצרים, יזמים ובעלי חזון כמוך לא נתקעים כי אין להם רעיונות. אתם נתקעים כי יש לכם{' '}
            <span className="text-brand-accent font-semibold">*יותר מדי*</span>{' '}
            מהם. הבלבול, חוסר המיקוד, והפער בין הדמיון למעשה – אלו המחסומים האמיתיים. אנחנו כאן כדי להראות לך שבעזרת שותף חכם, אפשר להפוך את הרעש הזה למוזיקה.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;