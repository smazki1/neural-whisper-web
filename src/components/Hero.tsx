import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-brand-primary overflow-hidden font-heebo" dir="rtl">
      {/* Neural Network Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="neural-network">
          {/* Animated dots */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="neural-dot"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-primary/20 via-transparent to-brand-primary/40"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-text leading-tight animate-fade-in">
            האם גם הראש שלך הוא{' '}
            <span className="text-brand-accent">מחסן לרעיונות גדולים</span>{' '}
            שמעלים אבק?
          </h1>

          {/* Sub-headline */}
          <h2 className="text-xl md:text-2xl lg:text-3xl text-brand-text/90 font-normal max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            הגיע הזמן להפסיק לפחד מהטכנולוגיה, ולהתחיל להשתמש בה כדי להפוך את המחשבות שלך למציאות.{' '}
            <span className="text-brand-accent font-semibold">AI Visionary</span>{' '}
            ילמד אותך איך.
          </h2>

          {/* CTA Button */}
          <div className="pt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button className="group relative px-8 py-4 bg-brand-accent text-brand-primary font-bold text-lg md:text-xl rounded-lg hover:bg-brand-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-accent/25 transform hover:scale-105">
              <span className="relative z-10">
                גלו איך להפוך רעיון למציאות
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-2 h-2 bg-brand-accent rounded-full opacity-60 animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-brand-accent rounded-full opacity-40 animate-pulse hidden lg:block"></div>
        <div className="absolute top-1/3 left-20 w-1 h-1 bg-brand-accent rounded-full opacity-80 animate-pulse hidden lg:block"></div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg
          className="w-6 h-6 text-brand-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;