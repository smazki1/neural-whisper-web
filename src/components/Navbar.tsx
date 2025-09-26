import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, LogOut, BookOpen, Menu, X, ChevronDown, Facebook, Instagram } from 'lucide-react';

interface NavbarProps {
  onContactClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInspirationDropdownOpen, setIsInspirationDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'אירועים קרובים', href: '/events', action: () => setIsComingSoonOpen(true) },
    { name: 'על אבי', href: '/about' },
    { name: 'תהליכים וקורסים', href: '/products' },
    { name: 'יעוץ אישי', href: '#', action: onContactClick },
    { name: 'הרצאות לארגונים', href: '#', action: () => setIsComingSoonOpen(true) },
    { 
      name: 'השראה', 
      href: '#', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'בלוג', href: '/blog' }
      ]
    },
    { name: 'יצירת קשר', href: '#', action: onContactClick }
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/avi.frid.3/', 
      icon: Facebook,
      color: 'hover:text-blue-500'
    },
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/avifrid_ai/', 
      icon: Instagram,
      color: 'hover:text-pink-500'
    }
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 font-heebo ${
          isScrolled
            ? 'modern-backdrop border-b border-accent/20'
            : 'bg-background/80 backdrop-blur-xl'
        }`}
        dir="rtl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Social Media & User Menu - Left Side */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-brand-light/60 ${social.color} transition-all duration-300 hover:scale-110`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>

              {/* User Menu or Login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" className="relative h-12 w-12 rounded-full modern-backdrop border border-accent/20">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.display_name || 'Profile'} />
                          <AvatarFallback className="bg-accent text-background font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 modern-backdrop border border-accent/20" align="start" forceMount>
                    <div className="flex items-center justify-start gap-3 p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-accent text-background">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="font-semibold text-brand-light">{user.user_metadata?.display_name || 'משתמש'}</p>
                        <p className="text-sm text-brand-light/60 truncate w-[160px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-accent/20" />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center px-4 py-3 hover:bg-accent/10">
                        <BookOpen className="ml-3 h-4 w-4 text-accent" />
                        <span className="text-brand-light">לוח הבקרה</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-accent/10">
                        <User className="ml-3 h-4 w-4 text-accent" />
                        <span className="text-brand-light">פרופיל</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/blog/manager" className="flex items-center px-4 py-3 hover:bg-accent/10">
                        <Settings className="ml-3 h-4 w-4 text-accent" />
                        <span className="text-brand-light">ניהול מאמרים</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin101" className="flex items-center px-4 py-3 hover:bg-accent/10">
                        <Settings className="ml-3 h-4 w-4 text-accent" />
                        <span className="text-brand-light">ניהול מערכת</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-accent/20" />
                    <DropdownMenuItem
                      className="cursor-pointer px-4 py-3 hover:bg-destructive/10"
                      onSelect={async (event) => {
                        event.preventDefault();
                        await signOut();
                        navigate('/');
                      }}
                    >
                      <LogOut className="ml-3 h-4 w-4 text-destructive" />
                      <span className="text-destructive">התנתק</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/auth')}
                      className="premium-button-secondary px-6 py-2 text-sm"
                    >
                      התחבר
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Navigation Links - Center */}
            <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
              {navigationItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div 
                      className="relative group"
                      onMouseEnter={() => setIsInspirationDropdownOpen(true)}
                      onMouseLeave={() => setIsInspirationDropdownOpen(false)}
                    >
                      <motion.button
                        className="flex items-center gap-1 text-brand-light/80 hover:text-accent transition-all duration-300 font-medium py-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.name}
                        <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                      </motion.button>
                      
                      <AnimatePresence>
                        {isInspirationDropdownOpen && (
                          <motion.div
                            className="absolute top-full right-0 mt-2 w-44 modern-backdrop border border-accent/20 rounded-xl shadow-xl overflow-hidden"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.href}
                                className="block w-full text-right px-4 py-3 text-brand-light/80 hover:text-accent hover:bg-accent/10 transition-all duration-200"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      {item.action ? (
                        <button
                          onClick={item.action}
                          className="text-brand-light/80 hover:text-accent transition-all duration-300 font-medium py-2 relative group"
                        >
                          {item.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          className="text-brand-light/80 hover:text-accent transition-all duration-300 font-medium py-2 relative group"
                        >
                          {item.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Brand Logo - Right Side */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="text-3xl font-bold premium-accent-gradient tracking-tight">
                AI Master
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-light hover:text-accent transition-colors duration-300 p-2"
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden modern-backdrop border-t border-accent/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-6 py-6">
                <div className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.hasDropdown ? (
                        <div className="space-y-2">
                          <div className="text-brand-light font-medium py-2 border-b border-accent/20">
                            {item.name}
                          </div>
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className="block text-brand-light/80 hover:text-accent transition-colors duration-200 py-2 pl-4"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      ) : item.action ? (
                        <button
                          onClick={() => {
                            item.action?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-right text-brand-light/80 hover:text-accent transition-colors duration-200 py-2"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          className="block text-brand-light/80 hover:text-accent transition-colors duration-200 py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Mobile Social Links */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-accent/20">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-brand-light/60 ${social.color} transition-colors duration-300`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </a>
                      );
                    })}
                  </div>

                  {/* Mobile Login Button */}
                  {!user && (
                    <div className="pt-4">
                      <Button
                        onClick={() => {
                          navigate('/auth');
                          setIsMobileMenuOpen(false);
                        }}
                        className="premium-button-primary w-full"
                      >
                        התחבר
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Coming Soon Dialog */}
      <Dialog open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <DialogContent className="modern-backdrop border border-accent/20 rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="premium-accent-gradient text-center text-2xl font-bold">
              בקרוב
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-brand-light text-lg mb-6 leading-relaxed">
                העמוד הזה נמצא בפיתוח ויהיה זמין בקרוב
              </p>
              <p className="text-brand-light/70 text-base">
                תודה על הסבלנות 🚀
              </p>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;