import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import {
  BarChart3,
  FileText,
  Package,
  MessageSquare,
  Settings,
  Users,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Home,
  BookOpen,
  Briefcase,
  Shield
} from 'lucide-react';

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'לוח בקרה',
    path: '/admin',
    icon: BarChart3,
    description: 'סקירה כללית וסטטיסטיקות'
  },
  {
    id: 'content',
    label: 'ניהול תוכן',
    path: '/admin/content',
    icon: FileText,
    description: 'מאמרים, עמודים ומדיה',
    submenu: [
      { id: 'blog', label: 'מאמרים', path: '/admin/content/blog' },
      { id: 'pages', label: 'עמודים', path: '/admin/content/pages' },
      { id: 'media', label: 'מדיה', path: '/admin/content/media' }
    ]
  },
  {
    id: 'products',
    label: 'מוצרים ושירותים',
    path: '/admin/products',
    icon: Package,
    description: 'ניהול מוצרים וקטגוריות',
    submenu: [
      { id: 'all-products', label: 'כל המוצרים', path: '/admin/products' },
      { id: 'add-product', label: 'הוסף מוצר', path: '/admin/products/new' },
      { id: 'categories', label: 'קטגוריות', path: '/admin/products/categories' }
    ]
  },
  {
    id: 'leads',
    label: 'לידים ופניות',
    path: '/admin/leads',
    icon: MessageSquare,
    description: 'ניהול פניות לקוחות'
  },
  {
    id: 'orders',
    label: 'הזמנות',
    path: '/admin/orders',
    icon: ShoppingCart,
    description: 'מעקב הזמנות ותשלומים'
  },
  {
    id: 'users',
    label: 'משתמשים',
    path: '/admin/users',
    icon: Users,
    description: 'ניהול משתמשים והרשאות'
  },
  {
    id: 'settings',
    label: 'הגדרות',
    path: '/admin/settings',
    icon: Settings,
    description: 'הגדרות מערכת ואתר'
  }
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { roles, loading: rolesLoading } = useUserRoles();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '100%' }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg">אזור ניהול</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            אדמין
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 bg-card border-l border-border min-h-screen">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {user?.user_metadata?.display_name || user?.email}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Shield className="h-3 w-3" />
                    {roles.includes('admin') ? 'מנהל מערכת' : 'משתמש'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="w-full gap-2"
            >
              <Home className="h-4 w-4" />
              חזרה לאתר
            </Button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <div key={item.id}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-auto p-3 ${
                    isActive(item.path) ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleSubmenu(item.id);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 text-right">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Button>

                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && expandedMenu === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 mr-8 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Button
                            key={subItem.id}
                            variant={isActive(subItem.path) ? "default" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => handleNavigation(subItem.path)}
                          >
                            {subItem.label}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full gap-2 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              יציאה
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={overlayVariants}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
              
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                className="lg:hidden fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 flex flex-col"
              >
                {/* Mobile Sidebar Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-bold text-lg">אזור ניהול</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {sidebarItems.map((item) => (
                    <div key={item.id}>
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          if (item.submenu) {
                            toggleSubmenu(item.id);
                          } else {
                            handleNavigation(item.path);
                          }
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Button>

                      {/* Mobile Submenu */}
                      <AnimatePresence>
                        {item.submenu && expandedMenu === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 mr-6 space-y-1">
                              {item.submenu.map((subItem) => (
                                <Button
                                  key={subItem.id}
                                  variant={isActive(subItem.path) ? "default" : "ghost"}
                                  size="sm"
                                  className="w-full justify-start text-sm"
                                  onClick={() => handleNavigation(subItem.path)}
                                >
                                  {subItem.label}
                                </Button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>

                <div className="p-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    יציאה
                  </Button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:min-h-screen">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};