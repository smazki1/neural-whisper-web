import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import productImageFallback from '@/assets/hero-bg-ai-modern.jpg';
import { resolveProductImageUrl } from '@/lib/productImage.js';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  thumbnail_url: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

const Checkout = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: user?.email || '',
    phone: ''
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, category, thumbnail_url')
        .eq('id', productId)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לטעון את פרטי המוצר',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: 'שגיאה',
        description: 'אנא מלא את כל השדות הנדרשים',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-icount-payment', {
        body: {
          productId: product?.id,
          userId: user?.id,
          customerInfo
        }
      });

      if (error) throw error;

      if (data.success && data.payment_url) {
        // Redirect to iCount payment page
        window.location.href = data.payment_url;
      } else {
        throw new Error('Failed to create payment page');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'שגיאה בתשלום',
        description: 'אירעה שגיאה בעת יצירת דף התשלום. אנא נסה שוב.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            המוצר לא נמצא
          </h1>
          <p className="text-muted-foreground mb-8">
            המוצר שחיפשת לא קיים או הוסר מהמערכת
          </p>
          <Link to="/products">
            <Button>
              <ArrowRight className="h-4 w-4 ml-2" />
              חזרה למוצרים
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const productImageUrl = resolveProductImageUrl(product.thumbnail_url, productImageFallback);

  return (
    <>
      <Helmet>
        <title>תשלום - {product.title} | AI Master</title>
        <meta name="description" content={`השלמת רכישת ${product.title}`} />
      </Helmet>

      <div className="min-h-screen bg-background pt-20" dir="rtl">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/products" className="hover:text-primary transition-colors">
                מוצרים
              </Link>
              <span>/</span>
              <Link to={`/products/${product.id}`} className="hover:text-primary transition-colors">
                {product.title}
              </Link>
              <span>/</span>
              <span className="text-foreground">תשלום</span>
            </nav>

            <h1 className="text-3xl font-bold text-foreground mb-8">
              השלמת הרכישה
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      סיכום הזמנה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      {productImageUrl && (
                        <img
                          src={productImageUrl}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.title}</h3>
                        <Badge variant="secondary">
                          {getCategoryLabel(product.category)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>סה"כ לתשלום:</span>
                        <span className="text-primary">₪{product.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        כולל מע"מ
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>תשלום מאובטח באמצעות iCount</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      פרטי התשלום
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">שם מלא *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          required
                          placeholder="הכנס את שמך המלא"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">כתובת אימייל *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                          required
                          placeholder="example@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">מספר טלפון</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="050-123-4567"
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={processing}
                        >
                          {processing ? 'מעבד תשלום...' : `המשך לתשלום ₪${product.price}`}
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        לחיצה על "המשך לתשלום" תעביר אותך לעמוד התשלום המאובטח של iCount
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
