import React from 'react';

const HeroFloatingElements = () => {
  return (
    <>
      <div className="absolute top-16 md:top-20 right-6 md:right-10 w-2 h-2 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-60 hidden lg:block"></div>
      <div className="absolute bottom-24 md:bottom-32 left-10 md:left-16 w-3 h-3 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-40 hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-12 md:left-20 w-1 h-1 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-80 hidden lg:block" style={{ animationDelay: '2s' }}></div>
    </>
  );
};

export default HeroFloatingElements;