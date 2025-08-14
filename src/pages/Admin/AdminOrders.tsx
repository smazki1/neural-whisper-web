import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart,
  Calendar,
  DollarSign,
  User,
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Order {
  id: string;
  user_id: string | null;
  product_id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  total_amount: number;
  created_at: string;
  updated_at: string;
  stripe_session_id: string | null;
  products?: {
    title: string;
    category: 'advanced' | 'basic' | 'business';
  };
  profiles?: {
    display_name: string | null;
  } | null;
}

interface AdminOrdersProps {
  onStatsUpdate?: () => void;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ onStatsUpdate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            category
          ),
          profiles (
            display_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as any) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת ההזמנות",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'completed' | 'failed' | 'refunded') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "סטטוס ההזמנה עודכן בהצלחה"
      });

      fetchOrders();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון סטטוס ההזמנה",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'ממתין',
      'completed': 'הושלם',
      'failed': 'נכשל',
      'cancelled': 'בוטל'
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'basic': 'בסיסי',
      'advanced': 'מתקדם',
      'business': 'עסקי'
    };
    return labels[category] || category;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול הזמנות</h2>
        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="סנן לפי סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל ההזמנות</SelectItem>
              <SelectItem value="pending">ממתינות</SelectItem>
              <SelectItem value="completed">הושלמו</SelectItem>
              <SelectItem value="failed">נכשלו</SelectItem>
              <SelectItem value="cancelled">בוטלו</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {filterStatus === 'all' ? 'אין הזמנות עדיין' : `אין הזמנות בסטטוס "${getStatusLabel(filterStatus)}"`}
            </h3>
            <p className="text-muted-foreground">
              ההזמנות יופיעו כאן כשיתחילו להגיע
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {order.products?.title || 'מוצר לא זמין'}
                      </h3>
                      <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{order.profiles?.display_name || 'משתמש אנונימי'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{getCategoryLabel(order.products?.category || '')}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">{formatCurrency(order.total_amount)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                    
                    {order.stripe_session_id && (
                      <div className="text-xs text-muted-foreground mt-2">
                        מזהה תשלום: {order.stripe_session_id.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          אשר
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, 'failed')}
                        >
                          דחה
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                      >
                        הפוך לממתין
                      </Button>
                    )}
                    
                    {order.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                      >
                        הפוך לממתין
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;