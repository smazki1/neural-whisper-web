import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-heebo"
      dir="rtl"
      style={{
        background: 'linear-gradient(135deg, hsl(289, 13%, 85%) 0%, hsl(0, 0%, 100%) 50%, hsl(289, 13%, 90%) 100%)'
      }}
    >
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(289, 13%, 75%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(289, 13%, 75%) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: 'hsl(289, 13%, 75%)',
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      >
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          style={{
            color: 'hsl(var(--brand-text))',
            textShadow: '0 2px 20px hsl(var(--brand-text) / 0.1)',
            filter: 'drop-shadow(0 0 1px hsl(var(--brand-text) / 0.1))',
          }}
        >
          <motion.span
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            להיות על זה בעידן ה-
            <span 
              className="premium-accent-gradient"
              style={{
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
              }}
            >
              AI
            </span>
          </motion.span>
        </motion.h1>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        onClick={scrollToNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className="relative flex flex-col items-center space-y-2 p-3 rounded-full transition-all duration-300"
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          style={{
            background: 'hsl(var(--brand-surface) / 0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.span 
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: 'hsl(var(--brand-text) / 0.7)' }}
            whileHover={{ color: 'hsl(var(--brand-accent))' }}
          >
            גלול למטה
          </motion.span>
          <motion.div
            whileHover={{ 
              color: 'hsl(var(--brand-accent))',
              filter: 'drop-shadow(0 0 8px hsl(var(--brand-accent) / 0.5))'
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown 
              className="w-5 h-5 transition-all duration-300" 
              style={{ color: 'hsl(var(--brand-text) / 0.7)' }}
            />
          </motion.div>
          
          {/* Subtle glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              borderColor: 'hsl(var(--brand-accent) / 0.3)',
            }}
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeOut"
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;