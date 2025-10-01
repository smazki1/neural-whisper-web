import React from 'react';
import { motion } from 'framer-motion';

const HeroContent = () => {
  return (
    <motion.div 
      className="space-y-12 md:space-y-16"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent blur-3xl animate-pulse" />
        <h1 className="relative text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] hebrew-mobile-wrap text-center">
          <span className="block text-brand-text mb-6">
            איך להצליח בעידן החדש -
          </span>
          <span className="block premium-accent-gradient mb-4">
            הפוך את הבינה המלאכותית
          </span>
          <span className="block text-brand-text">
            לכוח העל שלך
          </span>
        </h1>
      </motion.div>

      {/* Sub-headline */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative max-w-5xl mx-auto"
      >
        <div className="modern-backdrop rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-brand-text font-medium leading-relaxed hebrew-mobile-wrap text-center">
            <motion.span 
              className="block mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              בינה מלאכותית היא לא עוד כלי. זו שפה חדשה, דרך חשיבה חדשה,
            </motion.span>
            <motion.span 
              className="block mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              ויכולת להפוך רעיונות למציאות במהירות שלא הכרת.
            </motion.span>
            <motion.span 
              className="block font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              אני לא מלמד אותך איך לתפעל את התוכנה; אני מלמד אותך לחשוב, ליצור ולהוביל בעידן ה-
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 100%, 75%) 0%, hsl(43, 100%, 65%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 900,
                  textShadow: 'none',
                  filter: 'none',
                }}
              >
                AI
              </span>.
            </motion.span>
          </h2>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;