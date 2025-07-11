import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 font-heebo ${
        isScrolled
          ? 'bg-brand-primary border-b border-brand-surface'
          : 'bg-brand-primary/80 backdrop-blur-sm'
      }`}
      dir="rtl"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name - Right Side */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-brand-accent">
              AI Visionary
            </h1>
          </div>

          {/* Navigation Links and Contact Button - Left Side */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6 space-x-reverse">
              <a
                href="#home"
                className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
              >
                בית
              </a>
              <a
                href="#about"
                className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
              >
                אודות
              </a>
              <a
                href="#courses"
                className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
              >
                סדנאות וקורסים
              </a>
              <a
                href="#blog"
                className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
              >
                בלוג
              </a>
            </div>

            {/* Contact Button */}
            <button className="px-6 py-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-primary transition-all duration-200 rounded-md font-medium">
              צור קשר
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-brand-text hover:text-brand-accent">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;