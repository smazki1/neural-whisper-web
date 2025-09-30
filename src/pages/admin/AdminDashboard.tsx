import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Eye,
  MessageSquare,
  FileText,
  Calendar,
  Phone,
  Mail,
  PlusCircle,
  Edit,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyOrders: number;
  publishedProducts: number;
  totalLeads: number;
  newLeads: number;
  publishedPosts: number;
  totalPosts: number;
  weeklyViews: number;
  conversionRate: number;
  pendingOrders: number;
  completedOrders: number;
}

interface RecentActivity {
  id: string;
  type: 'lead' | 'order' | 'post' | 'user';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        usersResult,
        productsResult,
        publishedProductsResult,
        ordersResult,
        monthlyOrdersResult,
        pendingOrdersResult,
        completedOrdersResult,
        revenueResult,
        leadsResult,
        newLeadsResult,
        postsResult,
        publishedPostsResult,
        recentLeadsResult,
        recentOrdersResult,
        recentPostsResult
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfMonth()),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('orders').select('total_amount').eq('status', 'completed'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('leads').select('id, name, email, status, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('orders').select('id, total_amount, status, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('blog_posts').select('id, title, is_published, created_at').order('created_at', { ascending: false }).limit(3)
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const conversionRate = (leadsResult.count || 0) > 0 ? ((ordersResult.count || 0) / (leadsResult.count || 0)) * 100 : 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        publishedProducts: publishedProductsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        monthlyOrders: monthlyOrdersResult.count || 0,
        pendingOrders: pendingOrdersResult.count || 0,
        completedOrders: completedOrdersResult.count || 0,
        totalRevenue,
        totalLeads: leadsResult.count || 0,
        newLeads: newLeadsResult.count || 0,
        totalPosts: postsResult.count || 0,
        publishedPosts: publishedPostsResult.count || 0,
        weeklyViews: Math.floor(Math.random() * 1000) + 500, // Mock data - replace with real analytics
        conversionRate
      });

      // Combine recent activity
      const activity: RecentActivity[] = [
        ...((recentLeadsResult.data || []).map((lead: any) => ({
          id: lead.id,
          type: 'lead' as const,
          title: `ליד חדש: ${lead.name}`,
          description: lead.email,
          timestamp: lead.created_at,
          status: lead.status
        }))),
        ...((recentOrdersResult.data || []).map((order: any) => ({
          id: order.id,
          type: 'order' as const,
          title: `הזמנה חדשה`,
          description: `₪${order.total_amount}`,
          timestamp: order.created_at,
          status: order.status
        }))),
        ...((recentPostsResult.data || []).map((post: any) => ({
          id: post.id,
          type: 'post' as const,
          title: `פוסט: ${post.title}`,
          description: post.is_published ? 'פורסם' : 'טיוטה',
          timestamp: post.created_at,
          status: post.is_published ? 'published' : 'draft'
        })))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

      setRecentActivity(activity);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת נתוני הדאשבורד",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStartOfMonth = () => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return MessageSquare;
      case 'order': return ShoppingCart;
      case 'post': return FileText;
      case 'user': return Users;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string, status?: string) => {
    switch (type) {
      case 'lead':
        return status === 'new' ? 'text-blue-600' : 'text-gray-600';
      case 'order':
        return status === 'completed' ? 'text-green-600' : 'text-orange-600';
      case 'post':
        return status === 'published' ? 'text-green-600' : 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new_post':
        navigate('/admin/content/blog');
        break;
      case 'new_product':
        navigate('/admin/products/new');
        break;
      case 'view_leads':
        navigate('/admin/leads');
        break;
      case 'view_orders':
        navigate('/admin/orders');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>לוח בקרה - אזור ניהול</title>
        </Helmet>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>לוח בקרה - אזור ניהול</title>
        <meta name="description" content="לוח בקרה מנהלים - סקירה כללית של המערכת" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">לוח בקרה</h1>
            <p className="text-lg text-muted-foreground mt-1">
              סקירה כללית של פעילות המערכת
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            עודכן ב: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: he })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/users" className="block group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">משתמשים</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                <p className="text-xs text-muted-foreground">משתמשים רשומים</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/products" className="block group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">מוצרים</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.publishedProducts} פורסמו
                </p>
                <div className="mt-2">
                  <Progress 
                    value={stats?.totalProducts ? (stats.publishedProducts / stats.totalProducts) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/leads" className="block group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ליידים</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalLeads}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600 font-medium">{stats?.newLeads}</span> חדשים
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/orders" className="block group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">הכנסות</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">סך ההכנסות</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/orders" className="block group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">הזמנות</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalOrders}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    {stats?.completedOrders} הושלמו
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-orange-600" />
                    {stats?.pendingOrders} ממתינות
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/content" className="block group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">פוסטים</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.publishedPosts} פורסמו
                </p>
              </CardContent>
            </Card>
          </Link>

          <div className="block">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">שיעור המרה</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">מליידים להזמנות</p>
              </CardContent>
            </Card>
          </div>

          <Link to="/admin/orders" className="block group">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">הזמנות החודש</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.monthlyOrders}</div>
                <p className="text-xs text-muted-foreground">החודש הנוכחי</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                פעולות מהירות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={() => handleQuickAction('new_post')}
                  className="w-full justify-start gap-3"
                >
                  <FileText className="h-4 w-4" />
                  כתוב פוסט חדש
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('new_product')}
                  className="w-full justify-start gap-3"
                >
                  <Package className="h-4 w-4" />
                  הוסף מוצר חדש
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('view_leads')}
                  className="w-full justify-start gap-3"
                >
                  <MessageSquare className="h-4 w-4" />
                  נהל ליידים ({stats?.newLeads} חדשים)
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('view_orders')}
                  className="w-full justify-start gap-3"
                >
                  <ShoppingCart className="h-4 w-4" />
                  בדוק הזמנות ({stats?.pendingOrders} ממתינות)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                פעילות אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <ActivityIcon className={`h-4 w-4 mt-0.5 ${getActivityColor(activity.type, activity.status)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {activity.title}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.timestamp), 'dd/MM HH:mm', { locale: he })}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-6 text-muted-foreground">
                  אין פעילות אחרונה
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;