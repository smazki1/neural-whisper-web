import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductsSection = () => {
  const products = [
    {
      title: "הרצאות ושיתוף תובנות",
      description: "חקירת הפוטנציאל של AI בהקשרים שונים",
      href: "/contact",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: "סדנאות למידה",
      description: "התנסות מעשית בכלים ובגישות חדשות",
      href: "/contact",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: "מחקר ופיתוח משותף",
      description: "עבודה על שאלות מעניינות בתחום",
      href: "/contact",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: "שיתוף ידע",
      description: "יצירת תכנים ומדריכים לקהילה",
      href: "/contact",
      icon: (
        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <section id="offers" className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
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
            <span className="text-[#eec643] font-bold">ללמוד ולחקור יחד:</span>
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