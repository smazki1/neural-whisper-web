import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  BookOpen,
  FileText,
  MessageSquare
} from 'lucide-react';
import AdminProducts from './Admin/AdminProducts';
import AdminOrders from './Admin/AdminOrders';
import AdminUsers from './Admin/AdminUsers';
import AdminProductCourses from './Admin/AdminProductCourses';
import AdminContentServices from './Admin/AdminContentServices';
import AdminPortfolio from './Admin/AdminPortfolio';
import AdminLeads from './Admin/AdminLeads';
import { DashboardOverview } from '@/components/Admin/DashboardOverview';
import { ContentManager } from '@/components/Admin/ContentManager';
import { LeadPipeline } from '@/components/Admin/LeadPipeline';
import { SettingsPanel } from '@/components/Admin/SettingsPanel';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyOrders: number;
  publishedProducts: number;
}

const Admin = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get published products
      const { count: publishedProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Get total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get orders from this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Calculate total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        monthlyOrders: monthlyOrders || 0,
        publishedProducts: publishedProducts || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת נתוני הדאשבורד",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>אזור ניהול - AI Master</title>
        <meta name="description" content="פאנל ניהול למנהלי המערכת - ניהול מוצרים, הזמנות ומשתמשים" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              אזור ניהול
            </h1>
            <p className="text-lg text-muted-foreground">
              ניהול מוצרים, הזמנות ומשתמשים
            </p>
          </div>

          {/* Dashboard Stats */}
          <DashboardOverview onNavigateToTab={setActiveTab} />

          {/* Main Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                דאשבורד
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                ניהול תוכן
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                ליידים
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                מוצרים
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                הזמנות
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                משתמשים
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                הגדרות
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardOverview onNavigateToTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="blog">
              <ContentManager 
                onPostCreated={fetchDashboardStats}
                onPostUpdated={fetchDashboardStats}
              />
            </TabsContent>

            <TabsContent value="leads">
              <LeadPipeline onLeadUpdated={fetchDashboardStats} />
            </TabsContent>

            <TabsContent value="products">
              <AdminProducts onStatsUpdate={fetchDashboardStats} />
            </TabsContent>

            <TabsContent value="orders">
              <AdminOrders onStatsUpdate={fetchDashboardStats} />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsers onStatsUpdate={fetchDashboardStats} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>

            {/* Legacy tabs for backward compatibility */}
            <TabsContent value="courses">
              <AdminProductCourses />
            </TabsContent>

            <TabsContent value="content">
              <AdminContentServices />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;