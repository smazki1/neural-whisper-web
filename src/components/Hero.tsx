import React from 'react';
// To test different backgrounds, simply change the number below (01-11 available)
// hero-background-01.png through hero-background-10.png and hero-background-11.jpeg
import heroBackground from '../assets/backgrounds/hero/hero-background-19.png';
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
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden font-heebo pt-16 md:pt-16 pb-32"
      dir="rtl"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933]/70 via-[#101933]/70 to-[#101933]/90"></div>
      
      {/* Bottom Gradient Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#101933] to-transparent"></div>
      
      <HeroBackground />

      <div className="relative z-20 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <div className="space-y-8 md:space-y-12">
          <HeroContent />
          <HeroCTA onScrollToOffers={scrollToOffers} />
        </div>
        <HeroFloatingElements />
      </div>

      <HeroScrollIndicator />
    </section>
  );
};

export default Hero;