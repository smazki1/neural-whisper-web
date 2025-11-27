import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContent from "./pages/admin/AdminContent";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogManager from "./pages/BlogManager";
import BlogEditor from "./pages/BlogEditor";
import BusinessWorkshop from "./pages/BusinessWorkshop";
import AIStrategyCourse from "./pages/AIStrategyCourse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import LearningPlatform from "./pages/LearningPlatform";
import CourseManager from "./pages/CourseManager";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import AIMarketingAccelerator from "./pages/AIMarketingAccelerator";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import CorporateWorkshops from "./pages/CorporateWorkshops";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import { InstallPrompt } from "./components/PWA/InstallPrompt";
import { UpdatePrompt } from "./components/PWA/UpdatePrompt";
import { usePerformance } from "./hooks/usePerformance";
import { createOptimizedQueryClient } from "./hooks/useOptimizedQuery";
import { SEOProvider } from "./components/SEO/SEOProvider";
import { SkipLink } from "./components/Accessibility/SkipLink";
import { useAccessibility } from "./hooks/useAccessibility";

const queryClient = createOptimizedQueryClient();

const App = () => {
  usePerformance();
  useAccessibility();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SEOProvider>
              <SkipLink href="#main-content">דלג לתוכן הראשי</SkipLink>
              <SkipLink href="#main-navigation">דלג לניווט</SkipLink>
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordConfirm />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/manager" element={<ProtectedRoute allowedRoles={['admin']}><BlogManager /></ProtectedRoute>} />
            <Route path="/blog/editor" element={<ProtectedRoute allowedRoles={['admin']}><BlogEditor /></ProtectedRoute>} />
            <Route path="/blog/editor/:postId" element={<ProtectedRoute allowedRoles={['admin']}><BlogEditor /></ProtectedRoute>} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/consulting" element={<Contact />} />
              <Route path="/corporate-workshops" element={<CorporateWorkshops />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            <Route path="/business-workshop" element={<BusinessWorkshop />} />
            <Route path="/ai-strategy-course" element={<AIStrategyCourse />} />
            <Route path="/learn" element={<LearningPlatform />} />
            <Route path="/courses/manage" element={<ProtectedRoute><CourseManager /></ProtectedRoute>} />
            <Route path="/courses/:id" element={<Course />} />
            <Route path="/courses/:id/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* Admin dashboard with sidebar */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="content/*" element={<AdminContent />} />
              <Route path="content/blog" element={<AdminContent />} />
              <Route path="content/pages" element={<AdminContent />} />
              <Route path="content/media" element={<AdminContent />} />
              <Route path="products/*" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProducts />} />
              <Route path="products/categories" element={<AdminProducts />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="/landing/ai-marketing-accelerator" element={<AIMarketingAccelerator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
              </Routes>
              <InstallPrompt />
              <UpdatePrompt />
            </SEOProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;