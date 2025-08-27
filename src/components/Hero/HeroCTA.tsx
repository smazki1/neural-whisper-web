import React from 'react';

interface HeroCTAProps {
  onScrollToOffers: () => void;
}

const HeroCTA = ({ onScrollToOffers }: HeroCTAProps) => {
  return (
    <div className="animate-premium-fade-in" style={{ animationDelay: '0.6s' }}>
      <button 
        onClick={onScrollToOffers}
        className="premium-button-primary text-base md:text-lg lg:text-xl px-6 md:px-8 py-3 md:py-4 group hover:scale-105 transition-transform duration-300"
      >
        <span className="relative z-10 flex items-center justify-center gap-3 hebrew-mobile-wrap">
          צפו באירועים הקרובים
          <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default HeroCTA;