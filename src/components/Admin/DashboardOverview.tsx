import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
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
  Clock
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
}

interface RecentLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: string;
  source?: string;
  service_interest?: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  is_published: boolean;
  category: string;
  created_at: string;
}

interface DashboardOverviewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const DashboardOverview = ({ onNavigateToTab }: DashboardOverviewProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const analytics = useAnalytics();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [
        usersResult,
        productsResult,
        publishedProductsResult,
        ordersResult,
        monthlyOrdersResult,
        revenueResult,
        leadsResult,
        newLeadsResult,
        postsResult,
        publishedPostsResult,
        recentLeadsResult,
        recentPostsResult,
        topProductsResult
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', getStartOfMonth()),
        supabase.from('orders').select('total_amount').eq('status', 'completed'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(5)
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const conversionRate = (leadsResult.count || 0) > 0 ? ((ordersResult.count || 0) / (leadsResult.count || 0)) * 100 : 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        publishedProducts: publishedProductsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        monthlyOrders: monthlyOrdersResult.count || 0,
        totalRevenue,
        totalLeads: leadsResult.count || 0,
        newLeads: newLeadsResult.count || 0,
        totalPosts: postsResult.count || 0,
        publishedPosts: publishedPostsResult.count || 0,
        weeklyViews: Math.floor(Math.random() * 1000) + 500, // Mock data - replace with real analytics
        conversionRate
      });

      setRecentLeads(recentLeadsResult.data || []);
      setRecentPosts(recentPostsResult.data || []);
      setTopProducts(topProductsResult.data || []);

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

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'new': 'חדש',
      'contacted': 'נוצר קשר',
      'converted': 'הומר',
      'closed': 'נסגר'
    };
    return labels[status] || status;
  };

  const handleQuickAction = (action: string) => {
    analytics.trackEvent({
      action: 'admin_quick_action',
      category: 'admin',
      label: action
    });

    switch (action) {
      case 'new_post':
        onNavigateToTab?.('blog');
        break;
      case 'new_product':
        onNavigateToTab?.('products');
        break;
      case 'view_leads':
        onNavigateToTab?.('leads');
        break;
      case 'settings':
        onNavigateToTab?.('settings');
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך המשתמשים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">משתמשים רשומים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מוצרים</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.publishedProducts} פורסמו
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ליידים</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.newLeads} חדשים
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">סך ההכנסות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פוסטים</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.publishedPosts} פורסמו
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">צפיות שבועיות</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.weeklyViews}</div>
            <p className="text-xs text-muted-foreground">השבוע</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שיעור המרה</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">מליידים להזמנות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות החודש</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.monthlyOrders}</div>
            <p className="text-xs text-muted-foreground">מתוך {stats?.totalOrders} סה"כ</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleQuickAction('new_post')}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              פוסט חדש
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleQuickAction('new_product')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              מוצר חדש
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleQuickAction('view_leads')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              ניהול ליידים
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleQuickAction('settings')}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              הגדרות
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>ליידים אחרונים</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigateToTab?.('leads')}
            >
              צפה בכל →
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{lead.name}</span>
                    <Badge className={getLeadStatusColor(lead.status)}>
                      {getStatusLabel(lead.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    {lead.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: he })}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-muted-foreground">
                אין ליידים אחרונים
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>פוסטים אחרונים</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigateToTab?.('blog')}
            >
              צפה בכל →
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{post.title}</span>
                    <Badge variant={post.is_published ? "default" : "secondary"}>
                      {post.is_published ? 'פרסום' : 'טיוטה'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(post.created_at), 'dd/MM/yyyy HH:mm', { locale: he })}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-muted-foreground">
                אין פוסטים אחרונים
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};