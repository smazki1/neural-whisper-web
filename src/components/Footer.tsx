import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brand-surface py-12 font-heebo border-t border-brand-surface" dir="rtl">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-brand-accent">AI Master</h3>
            <p className="text-brand-text/80 leading-relaxed">
              הופכים רעיונות למציאות בעזרת בינה מלאכותית והכלים המתקדמים ביותר.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-brand-text">השירותים שלנו</h4>
            <ul className="space-y-2 text-brand-text/80">
              <li>
                <a href="/products" className="hover:text-brand-accent transition-colors duration-200">
                  מוצרים וסדנאות
                </a>
              </li>
              <li>
                <a href="/corporate-workshops" className="hover:text-brand-accent transition-colors duration-200">
                  ייעוץ AI והדרכות לארגונים
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-brand-accent transition-colors duration-200">
                  בלוג וטיפים
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-brand-accent transition-colors duration-200">
                  יצירת קשר
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-brand-text">צור קשר</h4>
            <div className="space-y-2 text-brand-text/80">
              <p>avi@ai-master.co.il</p>
              <p>052-777-2807</p>
              <div className="flex space-x-4 space-x-reverse pt-4">
                <a href="https://www.facebook.com/avi.frid.3" target="_blank" rel="noopener noreferrer" className="text-brand-text/80 hover:text-brand-accent transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12.06c0-5.51-4.49-10-10-10s-10 4.49-10 10c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.19 22 17.05 22 12.06z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/avi-frid-83426b202" target="_blank" rel="noopener noreferrer" className="text-brand-text/80 hover:text-brand-accent transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/avi_ai_frid/" target="_blank" rel="noopener noreferrer" className="text-brand-text/80 hover:text-brand-accent transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-surface mt-8 pt-8">
          <div className="flex justify-center items-center space-x-4 space-x-reverse mb-4">
            <a href="/privacy-policy" className="text-brand-text/60 hover:text-brand-accent transition-colors duration-200">
              מדיניות פרטיות
            </a>
            <span className="text-brand-text/40">|</span>
            <a href="/terms-of-service" className="text-brand-text/60 hover:text-brand-accent transition-colors duration-200">
              תקנון שימוש
            </a>
          </div>
          <p className="text-brand-text/60 text-center">
            © 2025 AI Master. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;