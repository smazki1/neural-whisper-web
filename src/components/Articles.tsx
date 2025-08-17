import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Articles = () => {
  const articles = [
    {
      title: "איך לגרום ל-ChatGPT לחשוב בדיוק כמוך",
      description: "המדריך המלא להטמעת הקול שלך ב-AI",
      href: "/blog/chatgpt-thinking-like-you",
      type: "המדריך"
    },
    {
      title: "בדוק כמה אתה מנצל מהפוטנציאל שלך",
      description: "כלי הערכה אישי לבדיקת יעילות ה-AI שלך",
      href: "/blog/ai-potential-test",
      type: "כלי"
    },
    {
      title: "5 דרכים להכפיל את היעילות שלך עם AI",
      description: "אסטרטגיות מתקדמות לשיפור ביצועים מיידי",
      href: "/blog/double-efficiency-ai",
      type: "אסטרטגיה"
    }
  ];

  return (
    <section className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0d1528] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight hebrew-mobile-wrap">
            <span className="text-[#eec643] font-bold">רעיונות ותכנים על AI:</span>
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
              className="premium-card p-6 relative group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#eec643]/10 via-transparent to-[#eec643]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#eec643]/20 text-[#eec643] text-sm font-medium rounded-full border border-[#eec643]/30">
                    {article.type}
                  </span>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-snug hebrew-mobile-wrap">
                  {article.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed hebrew-mobile-wrap">
                  {article.description}
                </p>
                
                <Link
                  to={article.href}
                  className="inline-flex items-center gap-2 text-[#eec643] hover:text-white transition-colors duration-200 font-medium"
                >
                  קרא עוד
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;