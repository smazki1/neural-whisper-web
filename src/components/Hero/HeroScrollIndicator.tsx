import React from 'react';
import { motion } from 'framer-motion';

const HeroScrollIndicator = () => {
  return (
    <motion.div 
      className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
    >
      <motion.div 
        className="modern-backdrop rounded-full p-3 md:p-4 cursor-pointer group"
        animate={{ y: [0, 8, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.svg 
          className="w-6 h-6 md:w-7 md:h-7 text-accent group-hover:drop-shadow-lg transition-all duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ 
            strokeWidth: [2, 2.5, 2]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </motion.svg>
      </motion.div>
      
      {/* Subtle pulse ring */}
      <motion.div
        className="absolute inset-0 border border-accent/30 rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

export default HeroScrollIndicator;