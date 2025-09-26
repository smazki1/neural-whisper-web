import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Home, User, BookOpen, MessageCircle, Menu, X } from 'lucide-react';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollDirection, scrollY } = useScrollDirection(10);
  const location = useLocation();

  // Hide/show navigation based on scroll direction
  const shouldHideNav = scrollDirection === 'down' && scrollY > 100;

  const navigationItems = [
    { name: 'בית', href: '/', icon: Home },
    { name: 'קורסים', href: '/products', icon: BookOpen },
    { name: 'אודות', href: '/about', icon: User },
    { name: 'יצירת קשר', href: '/contact', icon: MessageCircle },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Bottom Navigation Bar - Mobile */}
      <motion.nav
        className={`
          fixed bottom-0 left-0 right-0 z-40 md:hidden
          bg-background/95 backdrop-blur-xl border-t border-border
          ${className}
        `}
        initial={{ y: 100 }}
        animate={{ y: shouldHideNav ? 100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-lg
                  transition-all duration-200 touch-manipulation active:scale-95
                  ${isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-xs font-medium">{item.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
          
          {/* Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(true)}
            className="
              flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-lg
              text-muted-foreground hover:text-primary hover:bg-accent/50
              transition-all duration-200 touch-manipulation active:scale-95
            "
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">עוד</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="fixed inset-0 z-50 md:hidden overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="min-h-screen p-6 pt-20">
                {/* Close Button */}
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    fixed top-6 right-6 z-60 
                    min-w-[44px] min-h-[44px] p-2 rounded-full
                    bg-accent/20 text-foreground hover:bg-accent/30
                    transition-all duration-200 touch-manipulation active:scale-95
                  "
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Menu Items */}
                <div className="space-y-4 mt-8">
                  {[
                    { name: 'אירועים קרובים', href: '/events' },
                    { name: 'יעוץ אישי', href: '/consulting' },
                    { name: 'הרצאות לארגונים', href: '/business-workshop' },
                    { name: 'בלוג', href: '/blog' },
                    { name: 'לוח בקרה', href: '/dashboard', requireAuth: true },
                    { name: 'התחבר', href: '/auth', hideIfAuth: true },
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className="
                          block w-full p-4 rounded-xl
                          bg-card hover:bg-accent/50 border border-border/50
                          text-lg font-medium text-foreground
                          transition-all duration-200 touch-manipulation active:scale-[0.98]
                        "
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <motion.div
                  className="mt-12 pt-8 border-t border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">עקבו אחרינו</h3>
                  <div className="flex gap-4">
                    {[
                      { name: 'Facebook', href: 'https://www.facebook.com/avi.frid.3/' },
                      { name: 'Instagram', href: 'https://www.instagram.com/avifrid_ai/' },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          min-w-[44px] min-h-[44px] p-3 rounded-lg
                          bg-accent/20 text-muted-foreground hover:text-primary
                          transition-all duration-200 touch-manipulation active:scale-95
                        "
                      >
                        <span className="text-sm font-medium">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};