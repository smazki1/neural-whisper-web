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
    <section className="modern-section" dir="rtl">
      <div className="modern-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="modern-heading-2 mb-6 hebrew-mobile-wrap">
            <span className="modern-text-accent font-bold">תובנות ומדריכים</span>
          </h2>
        </motion.div>

        <div className="modern-grid-3">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="modern-card p-8 group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full border border-emerald-200">
                  {article.type}
                </span>
              </div>
              
              <h3 className="modern-heading-4 mb-4 hebrew-mobile-wrap">
                {article.title}
              </h3>
              
              <p className="modern-body mb-8 hebrew-mobile-wrap">
                {article.description}
              </p>
              
              <Link
                to={article.href}
                className="modern-link font-semibold"
              >
                קרא עוד
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
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