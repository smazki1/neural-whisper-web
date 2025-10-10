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
        </motion.div>

        {/* Two Button Layout */}
        <motion.div 
          className="flex flex-col gap-8 justify-center items-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="professional-button-primary text-xl lg:text-2xl px-8 py-6 w-full max-w-2xl text-center leading-relaxed"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { window.location.href = '/products'; }}
          >
            התחילו כאן
          </motion.button>
          
          <motion.button 
            className="professional-button-secondary text-xl lg:text-2xl px-8 py-6 w-full max-w-2xl text-center"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { window.location.href = '/corporate-workshops'; }}
          >
            ארגונים? אתם פה
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowICanHelpSection;
