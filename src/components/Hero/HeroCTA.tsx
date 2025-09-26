import React from 'react';
import { motion } from 'framer-motion';

interface HeroCTAProps {
  onScrollToOffers: () => void;
}

const HeroCTA = ({ onScrollToOffers }: HeroCTAProps) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6 }}
    >
      <motion.button
        onClick={onScrollToOffers}
        className="premium-button-primary modern-glow text-xl md:text-2xl px-10 md:px-14 py-5 md:py-6 group relative overflow-hidden"
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="relative z-10 flex items-center justify-center gap-4 hebrew-mobile-wrap font-semibold">
          הצטרפו למסע
          <motion.svg 
            className="w-6 h-6 md:w-7 md:h-7" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </motion.svg>
        </span>
        
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20"
          animate={{ 
            background: [
              "linear-gradient(90deg, hsl(48, 78%, 60%, 0.2) 0%, hsl(48, 78%, 60%, 0.1) 50%, hsl(48, 78%, 60%, 0.2) 100%)",
              "linear-gradient(90deg, hsl(48, 78%, 60%, 0.1) 0%, hsl(48, 78%, 60%, 0.3) 50%, hsl(48, 78%, 60%, 0.1) 100%)",
              "linear-gradient(90deg, hsl(48, 78%, 60%, 0.2) 0%, hsl(48, 78%, 60%, 0.1) 50%, hsl(48, 78%, 60%, 0.2) 100%)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
      
      {/* Subtle hint animation */}
      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-brand-light/60 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 3, repeat: Infinity, repeatDelay: 4 }}
      >
        ↓ גלה איך
      </motion.div>
    </motion.div>
  );
};

export default HeroCTA;