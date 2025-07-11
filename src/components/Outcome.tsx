import React from 'react';
import { motion } from 'framer-motion';

const Outcome = () => {
  const benefits = [
    {
      title: "תפסיק לפחד להישאר מאחור",
      text: "ותתחיל להוביל עם הכלים המתקדמים ביותר.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "תחסוך עשרות שעות עבודה",
      text: "על ידי ייעול של משימות ותהליכים עסקיים.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "תשחרר את הפקק המחשבתי",
      text: "ותראה את הרעיונות שלך מקבלים צורה מוחשית.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "תשפר את הפרודוקטיביות והיצירתיות",
      text: "ותגיע לתוצאות שלא חשבת שאפשריות.",
      icon: (
        <svg className="w-12 h-12 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-brand-primary font-heebo" dir="rtl">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-brand-text mb-8 leading-tight">
            <span className="text-brand-accent">תחושה של הקלה.</span>{' '}
            בהירות. ויצירה שיוצאת לעולם.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-brand-surface rounded-xl p-8 shadow-xl border border-brand-surface/50 hover:shadow-2xl hover:shadow-brand-accent/10 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-brand-accent/10 rounded-full">
                  {benefit.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-text mb-4">
                  {benefit.title}
                </h3>
                <p className="text-lg text-brand-text/90 leading-relaxed">
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