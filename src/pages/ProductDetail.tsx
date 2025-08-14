import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Clock, Tag, Play, Star, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  category: 'basic' | 'advanced' | 'business';
  product_type: 'course' | 'workshop' | 'consultation';
  duration: string;
  thumbnail_url: string;
  video_preview_url: string;
  is_featured: boolean;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to auth page
      navigate('/auth');
      return;
    }

    // Redirect to checkout page
    navigate(`/checkout/${product?.id}`);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      basic: 'בסיסי',
      advanced: 'מתקדם',
      business: 'עסקי'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      course: 'קורס',
      workshop: 'סדנה',
      consultation: 'ייעוץ'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
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

  return (
    <>
      <Helmet>
        <title>{product.title} | AI Master</title>
        <meta name="description" content={product.short_description || product.description} />
        <meta name="keywords" content={`AI, בינה מלאכותית, ${product.title}, ${getCategoryLabel(product.category)}`} />
      </Helmet>

      <div className="min-h-screen bg-background pt-20" dir="rtl">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/products" className="hover:text-primary transition-colors">
              מוצרים
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Media */}
            <div className="space-y-6">
              {product.video_preview_url ? (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    src={product.video_preview_url}
                    poster={product.thumbnail_url}
                    controls
                    className="w-full h-full object-cover"
                  >
                    דפדפן זה אינו תומך בוידאו
                  </video>
                </div>
              ) : product.thumbnail_url ? (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={product.thumbnail_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Play className="h-16 w-16 text-muted-foreground" />
                </div>
              )}

              {/* Product Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    מה תקבל במוצר זה
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>גישה מלאה לכל החומרים</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>תעודת סיום</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>תמיכה וליווי</span>
                  </div>
                  {product.duration && (
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>משך זמן: {product.duration}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    {getCategoryLabel(product.category)}
                  </Badge>
                  <Badge variant="outline">
                    {getTypeLabel(product.product_type)}
                  </Badge>
                  {product.is_featured && (
                    <Badge className="bg-primary text-primary-foreground">
                      מומלץ
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>

                {product.short_description && (
                  <p className="text-xl text-muted-foreground mb-6">
                    {product.short_description}
                  </p>
                )}

                <div className="flex items-center gap-4 mb-6">
                  {product.duration && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{product.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>4.8 (123 ביקורות)</span>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <Card className="border-2 border-primary">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {product.price > 0 ? `₪${product.price}` : 'חינם'}
                    </div>
                    {product.price > 0 && (
                      <p className="text-muted-foreground">תשלום חד פעמי</p>
                    )}
                  </div>

                  <Button
                    onClick={handlePurchase}
                    className="w-full mb-4"
                    size="lg"
                    disabled={purchasing}
                  >
                    {purchasing ? 'מעבד...' : product.price > 0 ? 'רכישה עכשיו' : 'התחל עכשיו'}
                  </Button>

                  {!user && (
                    <p className="text-sm text-muted-foreground text-center">
                      נדרשת התחברות לרכישה
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              {product.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>תיאור המוצר</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate max-w-none dark:prose-invert">
                      {product.description.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;