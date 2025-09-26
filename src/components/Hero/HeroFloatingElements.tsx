import React from 'react';
import { motion } from 'framer-motion';

const HeroFloatingElements = () => {
  const particles = [
    { size: 'w-2 h-2', delay: 0, duration: 4, position: { x: '85%', y: '20%' } },
    { size: 'w-3 h-3', delay: 1, duration: 6, position: { x: '15%', y: '75%' } },
    { size: 'w-1 h-1', delay: 2, duration: 5, position: { x: '20%', y: '35%' } },
    { size: 'w-1.5 h-1.5', delay: 3, duration: 7, position: { x: '75%', y: '65%' } },
    { size: 'w-2 h-2', delay: 4, duration: 4.5, position: { x: '60%', y: '25%' } },
    { size: 'w-1 h-1', delay: 5, duration: 6.5, position: { x: '30%', y: '80%' } }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className={`absolute ${particle.size} premium-accent-gradient rounded-full opacity-60`}
          style={{ 
            left: particle.position.x, 
            top: particle.position.y,
            filter: 'drop-shadow(0 0 8px hsl(48, 78%, 60%, 0.6))'
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
      
      {/* Connecting lines animation */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {particles.slice(0, 3).map((_, index) => (
          <motion.line
            key={`line-${index}`}
            x1={`${Math.random() * 80 + 10}%`}
            y1={`${Math.random() * 60 + 20}%`}
            x2={`${Math.random() * 80 + 10}%`}
            y2={`${Math.random() * 60 + 20}%`}
            stroke="hsl(48, 78%, 60%)"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 2
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default HeroFloatingElements;