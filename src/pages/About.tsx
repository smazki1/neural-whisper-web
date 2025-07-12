import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';

const About = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleContactClose = () => {
    setIsContactModalOpen(false);
  };

  return (
    <div className="bg-[#101933] text-[#d8d5db] font-['Heebo']">
      <Navbar onContactClick={handleContactClick} />
      <main>
        <section className="py-20 font-heebo relative overflow-hidden" dir="rtl">
          {/* Premium Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
          
          {/* Ambient Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h1 className="text-3xl md:text-5xl font-bold premium-text-gradient leading-tight">
                <span className="text-brand-accent">הסיפור שלי,</span>{' '}
                וה'למה' מאחורי המשימה
              </h1>
            </motion.div>

            {/* Video Container with Yellow Frame */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative mb-16"
            >
              {/* Yellow Accent Frame */}
              <div className="relative p-1 bg-gradient-to-r from-[#eec643] via-[#eec643]/80 to-[#eec643] rounded-2xl">
                <div className="relative bg-[#101933] rounded-xl overflow-hidden">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src="https://www.youtube.com/embed/14bZqkWs5ng"
                      title="הסיפור שלי, וה'למה' מאחורי המשימה"
                      className="absolute inset-0 w-full h-full rounded-xl"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/20 via-transparent to-[#eec643]/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "ניסיון מעשי",
                  description: "שנים של עבודה עם יוצרים ויזמים",
                  icon: (
                    <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "גישה אישית",
                  description: "כל פרויקט מקבל את הטיפול הייחודי שלו",
                  icon: (
                    <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  title: "תוצאות מוכחות",
                  description: "רעיונות שהפכו למציאות מוצלחת",
                  icon: (
                    <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="glassmorphism-dark p-6 rounded-xl border border-[#eec643]/20 text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-brand-accent/10 rounded-full border border-[#eec643]/20">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-brand-accent mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-brand-text/80 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
    </div>
  );
};

export default About; 