import React from 'react';
import { motion } from 'framer-motion';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      {/* Main ambient light */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(48, 78%, 60%, 0.15) 0%, hsl(48, 78%, 60%, 0.05) 50%, transparent 100%)'
        }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
          x: [0, 20, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
      />
      
      {/* Secondary ambient light */}
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(222, 53%, 28%, 0.2) 0%, hsl(218, 50%, 16%, 0.1) 50%, transparent 100%)'
        }}
        animate={{ 
          scale: [1.1, 0.9, 1.1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, -15, 0],
          y: [0, 15, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Subtle top accent */}
      <motion.div 
        className="absolute top-1/6 right-1/3 w-64 h-64 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, hsl(48, 78%, 60%, 0.08) 0%, transparent 70%)'
        }}
        animate={{ 
          scale: [0.8, 1.3, 0.8],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Dynamic grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(48, 78%, 60%, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(48, 78%, 60%, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
    </div>
  );
};

export default HeroBackground;