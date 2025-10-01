import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import heroBackground from '../assets/hero-bg-ai-modern.jpg';

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
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-heebo group cursor-default"
      dir="rtl"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dynamic Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-brand-text/60 via-brand-text/50 to-brand-text/40 transition-opacity duration-800 ease-in-out group-hover:opacity-40"
        initial={{ opacity: 0.5 }}
      />
      
      {/* Fallback Background */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, hsl(289, 13%, 85%) 0%, hsl(0, 0%, 100%) 50%, hsl(289, 13%, 90%) 100%)'
        }}
      />
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] tracking-wide text-white relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          style={{
            textShadow: '0 4px 40px rgba(0, 0, 0, 0.8), 0 2px 20px rgba(0, 0, 0, 0.6)',
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.1))',
          }}
          whileHover={{
            filter: 'drop-shadow(0 0 20px rgba(238, 198, 67, 0.4)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.2))',
            textShadow: '0 4px 40px rgba(0, 0, 0, 0.8), 0 2px 20px rgba(238, 198, 67, 0.3)',
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
            <motion.span 
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, hsl(45, 100%, 75%) 0%, hsl(43, 100%, 65%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 900,
              }}
              whileHover={{
                scale: 1.08,
              }}
              transition={{ duration: 0.3 }}
            >
              AI
            </motion.span>
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
            className="text-sm font-medium text-white/80 transition-colors duration-300"
            whileHover={{ color: 'hsl(var(--brand-accent))' }}
          >
            גלול למטה
          </motion.span>
          <motion.div
            animate={{ 
              y: [0, -2, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            whileHover={{ 
              color: 'hsl(var(--brand-accent))',
              filter: 'drop-shadow(0 0 12px hsl(var(--brand-accent) / 0.8))',
              scale: 1.1,
            }}
          >
            <ChevronDown 
              className="w-5 h-5 text-white/80 transition-all duration-300" 
            />
          </motion.div>
          
          {/* Subtle glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-brand-accent/30 opacity-0 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0, 0.4, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeOut"
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;