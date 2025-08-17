import React from 'react';

const HeroContent = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Main Headline */}
      <div className="animate-premium-fade-in">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight hebrew-mobile-wrap">
          <span className="block text-white mb-2 md:mb-4">איך להפוך את הפוטנציאל שלך</span>
          <span className="block text-[#eec643] md:animate-premium-glow-pulse">לכוח על בעידן החדש?</span>
          <span className="block text-white mt-2 md:mt-4">גלה איך לעשות מ-AI את השותף שמוציא את הגאונות שלך - גם בלי להיות טכנולוג</span>
        </h1>
      </div>

      {/* Sub-headline */}
      <div className="animate-premium-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glassmorphism-dark rounded-2xl p-6 md:p-8 lg:p-10 max-w-4xl mx-auto border border-[#eec643]/20">
          <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 font-normal leading-relaxed hebrew-mobile-wrap">
            הפוך את הבינה המלאכותית לעוזר האישי שמבין אותך, חושב איתך, ויוצר עבורך תוצאות שלא הכרת
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;