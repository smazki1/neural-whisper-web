import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, LogOut, BookOpen } from 'lucide-react';

interface NavbarProps {
  onContactClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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
          {/* User Menu or Contact Button - Far Left (in RTL) */}
          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.display_name || 'Profile'} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.user_metadata?.display_name || 'משתמש'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>לוח הבקרה</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>פרופיל</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/courses/manage" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>ניהול קורסים</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/blog/manager" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>ניהול מאמרים</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin101" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>ניהול מערכת (אדמין)</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={async (event) => {
                      event.preventDefault();
                      await signOut();
                      navigate('/');
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>התנתק</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-primary"
                >
                  התחבר
                </Button>
                <button
                  onClick={onContactClick}
                  className="px-4 py-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-primary transition-all duration-200 rounded-md font-medium text-sm"
                >
                  צור קשר
                </button>
              </div>
            )}
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
              to="/blog"
              className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              מאמרים ומדריכים
            </Link>
            <div className="relative group">
              <Link
                to="/products"
                className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium cursor-pointer"
              >
                מוצרים
              </Link>
              <div className="absolute top-full right-0 mt-2 w-64 bg-brand-primary border border-brand-surface rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/products?category=digital"
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  קורסים דיגיטליים
                </Link>
                <Link
                  to="/products?category=workshops"
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  סדנאות
                </Link>
                <button
                  onClick={onContactClick}
                  className="block w-full text-right px-4 py-3 text-brand-text hover:text-brand-accent hover:bg-brand-surface transition-colors duration-200"
                >
                  ייעוץ אישי
                </button>
              </div>
            </div>
            <Link
              to="/about"
              className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              אודות
            </Link>
            <button
              onClick={onContactClick}
              className="text-brand-text hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              צור קשר
            </button>
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