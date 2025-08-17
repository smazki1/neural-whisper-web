import React from 'react';

const HeroContent = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Main Headline */}
      <div className="animate-premium-fade-in">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight hebrew-mobile-wrap">
          <span className="block text-[#eec643] md:animate-premium-glow-pulse">איך לנצל את הפוטנציאל של בינה מלאכותית בחיים שלנו</span>
        </h1>
      </div>

      {/* Sub-headline */}
      <div className="animate-premium-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glassmorphism-dark rounded-2xl p-6 md:p-8 lg:p-10 max-w-4xl mx-auto border border-[#eec643]/20">
          <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 font-normal leading-relaxed hebrew-mobile-wrap">
            חקירה של הדרכים בהן טכנולוגיית AI יכולה לשמש ככלי להתפתחות אישית ופרודוקטיביות שמוציא את הפוטנציאל הטמון בנו
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;