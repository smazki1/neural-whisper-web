import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface NavbarProps {
  onContactClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

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
          {/* Contact Button - Far Left (in RTL) */}
          <div className="hidden md:block">
            <button
              onClick={onContactClick}
              className="px-6 py-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-primary transition-all duration-200 rounded-md font-medium"
            >
              צור קשר
            </button>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link
              to="/"
              className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              בית
            </Link>
            <Link
              to="/about"
              className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              אודות
            </Link>
            <div className="relative group">
              <span className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium cursor-pointer">
                עסקים
              </span>
              <div className="absolute top-full right-0 mt-2 w-64 bg-brand-primary border border-brand-surface rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={() => setIsComingSoonOpen(true)}
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  סדנת AI לעסקים
                  <span className="text-xs text-brand-accent mr-2">בקרוב</span>
                </button>
                <button
                  onClick={() => setIsComingSoonOpen(true)}
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  קורס AI אסטרטגי
                  <span className="text-xs text-brand-accent mr-2">בקרוב</span>
                </button>
              </div>
            </div>
            <a
              href="#courses"
              className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              סדנאות וקורסים
            </a>
            <div className="relative group">
              <span className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium cursor-pointer">
                פלטפורמת למידה
              </span>
              <div className="absolute top-full right-0 mt-2 w-64 bg-brand-primary border border-brand-surface rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/courses"
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  קורסים מפורסמים
                </Link>
                <Link
                  to="/learn"
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  פלטפורמת למידה מלאה
                </Link>
                <Link
                  to="/courses/manage"
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  ניהול קורסים
                  <span className="text-xs text-brand-accent mr-2">דורש הרשמה</span>
                </Link>
              </div>
            </div>
            <Link
              to="/blog"
              className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              בלוג
            </Link>
          </div>

          {/* Brand Name - Far Right (in RTL) */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-brand-accent">
              AI Master
            </Link>
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
      
      <Dialog open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <DialogContent className="bg-brand-primary border border-brand-surface" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-brand-accent text-center text-xl">
              בקרוב
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-brand-text text-lg mb-4">
              העמוד הזה נמצא בפיתוח ויהיה זמין בקרוב
            </p>
            <p className="text-brand-text/80">
              תודה על הסבלנות 🚀
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;