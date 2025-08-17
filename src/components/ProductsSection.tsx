import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductsSection = () => {
  const products = [
    {
      title: "קורס AI אסטרטגי",
      description: "הקורס המלא להטמעת AI בחיים האישיים והעסקיים",
      href: "/products/ai-strategy-course",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "סדנת AI לעסקים",
      description: "סדנה מתקדמת ליישום AI בעסק שלך",
      href: "/products/business-workshop",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "מאיץ AI שיווקי",
      description: "הכלים המתקדמים לשיווק דיגיטלי עם AI",
      href: "/products/marketing-accelerator",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "ייעוץ אישי",
      description: "ייעוץ אישי מותאם להטמעת AI בתחום שלך",
      href: "/contact",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight hebrew-mobile-wrap">
            <span className="text-[#eec643] font-bold">רוצה להעמיק?</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="premium-card p-6 relative group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#eec643]/10 via-transparent to-[#eec643]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-[#eec643]/10 rounded-full border border-[#eec643]/20">
                    {product.icon}
                  </div>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-snug hebrew-mobile-wrap">
                  {product.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed hebrew-mobile-wrap">
                  {product.description}
                </p>
                
                <Link
                  to={product.href}
                  className="inline-flex items-center gap-2 text-[#eec643] hover:text-white transition-colors duration-200 font-medium"
                >
                  למד עוד
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

export default ProductsSection;