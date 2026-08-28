import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import { AdminLayout } from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { InstallPrompt } from "./components/PWA/InstallPrompt";
import { UpdatePrompt } from "./components/PWA/UpdatePrompt";
import { usePerformance } from "./hooks/usePerformance";
import { createOptimizedQueryClient } from "./hooks/useOptimizedQuery";
import { SEOProvider } from "./components/SEO/SEOProvider";
import { SkipLink } from "./components/Accessibility/SkipLink";
import { useAccessibility } from "./hooks/useAccessibility";

const About = lazy(() => import("./pages/About"));
const DigitalCard = lazy(() => import("./pages/DigitalCard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogManager = lazy(() => import("./pages/BlogManager"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const BusinessWorkshop = lazy(() => import("./pages/BusinessWorkshop"));
const AIStrategyCourse = lazy(() => import("./pages/AIStrategyCourse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LearningPlatform = lazy(() => import("./pages/LearningPlatform"));
const CourseManager = lazy(() => import("./pages/CourseManager"));
const Course = lazy(() => import("./pages/Course"));
const Lesson = lazy(() => import("./pages/Lesson"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResetPasswordConfirm = lazy(() => import("./pages/ResetPasswordConfirm"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const AIMarketingAccelerator = lazy(() => import("./pages/AIMarketingAccelerator"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const CorporateWorkshops = lazy(() => import("./pages/CorporateWorkshops"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("./pages/PaymentCanceled"));

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
              <Suspense fallback={<div role="status" className="min-h-screen grid place-items-center">טוען...</div>}>
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordConfirm />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/avi" element={<DigitalCard />} />
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
              </Suspense>
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
