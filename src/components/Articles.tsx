import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Articles = () => {
  const articles = [
    {
      title: "איך לפתח דיאלוג משמעותי עם AI",
      description: "כלים ושיטות ליצירת תקשורת עמוקה יותר עם בינה מלאכותית",
      href: "/blog/meaningful-ai-dialogue",
      type: "מדריך"
    },
    {
      title: "הפילוסופיה מאחורי שיתוף פעולה אדם-מכונה",
      description: "חקירה של המשמעות העמוקה של העבודה המשותפת עם AI",
      href: "/blog/human-ai-collaboration-philosophy",
      type: "תובנה"
    },
    {
      title: "כלים לחשיבה יצירתית עם בינה מלאכותית",
      description: "גישות מעשיות לפיתוח יצירתיות בעזרת AI",
      href: "/blog/creative-thinking-ai-tools",
      type: "כלים"
    }
  ];

  return (
    <section className="py-16 md:py-20 font-heebo professional-section-alt" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold professional-text-primary mb-6 leading-tight hebrew-mobile-wrap">
            <span className="professional-text-accent font-bold">תובנות ומדריכים:</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="professional-card p-6 group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-accent/10 professional-text-accent text-sm font-semibold rounded-full border border-accent/20">
                  {article.type}
                </span>
              </div>
              
              <h3 className="text-lg md:text-xl font-bold professional-text-primary mb-3 leading-snug hebrew-mobile-wrap">
                {article.title}
              </h3>
              
              <p className="professional-text-body mb-6 leading-relaxed hebrew-mobile-wrap">
                {article.description}
              </p>
              
              <Link
                to={article.href}
                className="inline-flex items-center gap-2 professional-text-accent hover:text-accent transition-colors duration-200 font-semibold"
              >
                קרא עוד
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;