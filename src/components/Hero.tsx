import React from 'react';
import heroBackground from '../assets/hero-background.jpg';

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
      {/* Subtle Ambient Gradient Overlays */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <div className="space-y-6 md:space-y-8">
          {/* Main Headline */}
          <div className="animate-premium-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block premium-text-gradient mb-2 md:mb-4">איך להפוך את ה-AI לשותף</span>
              <span className="block premium-accent-gradient md:animate-premium-glow-pulse">שמוציא את הגאונות שלכם,</span>
              <span className="block premium-text-gradient mt-2 md:mt-4">גם בלי להיות טכנולוגים</span>
            </h1>
          </div>

          {/* Sub-headline */}
          <div className="animate-premium-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="glassmorphism-dark rounded-2xl p-6 md:p-8 lg:p-10 max-w-4xl mx-auto border border-[#eec643]/20">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl premium-text-gradient font-normal leading-relaxed">
                גלו את השיטות לעבודה נכונה עם כלי AI, שיזניקו את היכולות שלכם ויאפשרו לכם ליצור ברמה שלא הכרתם.
              </h2>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-premium-fade-in" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={scrollToOffers}
              className="premium-button-primary text-base md:text-lg lg:text-xl px-6 md:px-8 py-3 md:py-4 group hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                הראה לי איך להפוך גאונות לתוצאות
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-16 md:top-20 right-6 md:right-10 w-2 h-2 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-60 hidden lg:block"></div>
        <div className="absolute bottom-24 md:bottom-32 left-10 md:left-16 w-3 h-3 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-40 hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-12 md:left-20 w-1 h-1 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-80 hidden lg:block" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glassmorphism rounded-full p-2 md:p-3 animate-bounce">
          <svg className="w-5 h-5 md:w-6 md:h-6 premium-accent-gradient" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;