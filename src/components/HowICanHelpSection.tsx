import React from 'react';
import { motion } from 'framer-motion';

const HowICanHelpSection = () => {
  return (
    <section className="py-20 lg:py-32 relative professional-section-alt" dir="rtl">
      <div className="section-divider"></div>
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="block professional-text-primary mb-2">להצליח לעבוד עם AI</span>
            <span className="block professional-text-accent">מבלי ללכת לאיבוד</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl lg:text-2xl professional-text-body max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            קורסים, תהליכי ליווי, הרצאות וסדנאות – הכל כאן
          </motion.p>
        </motion.div>

        {/* Two Button Layout */}
        <motion.div 
          className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="professional-button-primary text-2xl px-12 py-6 w-full md:w-auto min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {/* Link to corporate services */}}
          >
            ארגונים?
          </motion.button>
          
          <motion.button 
            className="professional-button-secondary text-2xl px-12 py-6 w-full md:w-auto min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {/* Link to individual services */}}
          >
            אתם פה
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowICanHelpSection;
