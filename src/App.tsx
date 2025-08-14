import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BusinessWorkshop from "./pages/BusinessWorkshop";
import AIStrategyCourse from "./pages/AIStrategyCourse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import LearningPlatform from "./pages/LearningPlatform";
import CourseManager from "./pages/CourseManager";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Auth from "./pages/Auth";
import AIMarketingAccelerator from "./pages/AIMarketingAccelerator";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            <Route path="/business-workshop" element={<BusinessWorkshop />} />
            <Route path="/ai-strategy-course" element={<AIStrategyCourse />} />
            <Route path="/learn" element={<LearningPlatform />} />
            <Route path="/courses/manage" element={<ProtectedRoute><CourseManager /></ProtectedRoute>} />
            <Route path="/courses/:id" element={<div className="p-8 text-center"><h1>Course View - Coming Soon</h1></div>} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin101" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
            <Route path="/landing/ai-marketing-accelerator" element={<AIMarketingAccelerator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
