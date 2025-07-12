import React from 'react';
import heroBackground from '../assets/hero-background.jpg';
import HeroBackground from './Hero/HeroBackground';
import HeroContent from './Hero/HeroContent';
import HeroCTA from './Hero/HeroCTA';
import HeroFloatingElements from './Hero/HeroFloatingElements';
import HeroScrollIndicator from './Hero/HeroScrollIndicator';

const Hero = () => {
  const scrollToOffers = () => {
    const offersSection = document.getElementById('offers');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-heebo pt-16 md:pt-16"
      dir="rtl"
      style={{
        backgroundImage: `linear-gradient(rgba(16, 25, 51, 0.7), rgba(16, 25, 51, 0.7)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <HeroBackground />

      <div className="relative z-20 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <HeroContent />
        <HeroCTA onScrollToOffers={scrollToOffers} />
        <HeroFloatingElements />
      </div>

      <HeroScrollIndicator />
    </section>
  );
};

export default Hero;