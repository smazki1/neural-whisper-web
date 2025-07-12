import React from 'react';

const HeroScrollIndicator = () => {
  return (
    <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="glassmorphism rounded-full p-2 md:p-3 animate-bounce">
        <svg className="w-5 h-5 md:w-6 md:h-6 premium-accent-gradient" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </div>
  );
};

export default HeroScrollIndicator;