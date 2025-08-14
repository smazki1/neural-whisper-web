import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  products: {
    title: string;
    category: string;
  };
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(title, category)')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      basic: 'בסיסי',
      advanced: 'מתקדם',
      business: 'עסקי'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <>
      <Helmet>
        <title>תשלום בוצע בהצלחה | AI Master</title>
        <meta name="description" content="תודה על הרכישה! התשלום בוצע בהצלחה" />
      </Helmet>

      <div className="min-h-screen bg-background pt-20" dir="rtl">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                תשלום בוצע בהצלחה!
              </h1>
              <p className="text-xl text-muted-foreground">
                תודה על הרכישה שלך
              </p>
            </div>

            {/* Order Details */}
            {loading ? (
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ) : order ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>פרטי הרכישה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold">{order.products.title}</h3>
                    <p className="text-muted-foreground">
                      {getCategoryLabel(order.products.category)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">מספר הזמנה:</span>
                    <span className="font-mono">{order.id.substring(0, 8)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">סכום ששולם:</span>
                    <span className="text-xl font-bold text-primary">₪{order.total_amount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">תאריך רכישה:</span>
                    <span>{new Date(order.created_at).toLocaleDateString('he-IL')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">סטטוס:</span>
                    <span className="text-green-600 font-semibold">
                      {order.status === 'completed' ? 'הושלם' : 'ממתין לאישור'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8">
                <CardContent className="p-8">
                  <p className="text-muted-foreground">
                    לא ניתן לטעון את פרטי ההזמנה
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  מה הצעד הבא?
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  קיבלת אישור רכישה למייל שלך. אם רכשת קורס, תוכל לגשת אליו דרך פלטפורמת הלמידה.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/learn">
                    <Button size="lg" className="w-full sm:w-auto">
                      <BookOpen className="h-4 w-4 ml-2" />
                      עבור לפלטפורמת הלמידה
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" className="w-full sm:w-auto">
                      <ArrowRight className="h-4 w-4 ml-2" />
                      התחבר לחשבון
                    </Button>
                  </Link>
                )}
                
                <Link to="/products">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <ArrowRight className="h-4 w-4 ml-2" />
                    המשך לקניות
                  </Button>
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-muted-foreground">
                צריך עזרה? צור איתנו קשר ב-
                <a href="mailto:support@aimaster.co.il" className="text-primary hover:underline mr-1">
                  support@aimaster.co.il
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;