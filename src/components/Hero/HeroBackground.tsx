import React from 'react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default HeroBackground;