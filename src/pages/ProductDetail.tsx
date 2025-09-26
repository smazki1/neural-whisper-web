import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Clock, Tag, Play, Star, Check, BookOpen } from 'lucide-react';
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
  const [linkedCourses, setLinkedCourses] = useState<any[]>([]);

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

      // Fetch linked courses
      if (data) {
        const { data: coursesData, error: coursesError } = await supabase
          .from("products_courses")
          .select(`
            courses (
              id,
              title,
              description,
              duration,
              published
            )
          `)
          .eq("product_id", data.id);

        if (!coursesError && coursesData) {
          setLinkedCourses(coursesData.map(item => item.courses).filter(Boolean));
        }
      }
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
      consultation: 'ייעוץ',
      lecture: 'הרצאה'
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
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.short_description || product.description} />
        <meta property="og:image" content={product.thumbnail_url || ''} />
        <meta property="og:type" content="product" />
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

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {getCategoryLabel(product.category)}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {getTypeLabel(product.product_type)}
              </Badge>
              {product.is_featured && (
                <Badge className="bg-brand-accent text-brand-text text-lg px-4 py-2">
                  מומלץ
                </Badge>
              )}
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-brand-text mb-6">
              {product.title}
            </h1>

            {product.short_description && (
              <p className="text-2xl text-brand-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
                {product.short_description}
              </p>
            )}

            <div className="flex items-center justify-center gap-6 mb-8">
              {product.duration && (
                <div className="flex items-center gap-2 text-brand-text-secondary">
                  <Clock className="h-5 w-5" />
                  <span className="text-lg">{product.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-brand-text-secondary">
                <Star className="h-5 w-5 fill-current text-yellow-500" />
                <span className="text-lg">4.8 (123 ביקורות)</span>
              </div>
            </div>

            <div className="text-5xl font-bold text-brand-accent mb-8">
              {product.price > 0 ? `₪${product.price.toLocaleString()}` : 'חינם'}
            </div>

            <Button
              onClick={handlePurchase}
              className="premium-button-primary text-xl px-12 py-4"
              size="lg"
              disabled={purchasing}
            >
              {purchasing ? 'מעבד...' : product.price > 0 ? 'רכישה עכשיו' : 'התחל עכשיו'}
            </Button>

            {!user && (
              <p className="text-brand-text-secondary mt-4">
                נדרשת התחברות לרכישה
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Media */}
            <div className="space-y-6">
              {product.video_preview_url ? (
                <div className="relative aspect-video bg-muted rounded-xl overflow-hidden shadow-2xl">
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
                <div className="relative aspect-video bg-muted rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={product.thumbnail_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center shadow-2xl">
                  <Play className="h-16 w-16 text-muted-foreground" />
                </div>
              )}

              {/* What's Included */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brand-text">
                    <Check className="h-5 w-5 text-brand-accent" />
                    מה כלול במוצר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <span className="text-brand-text">גישה מלאה לכל החומרים הדיגיטליים</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <span className="text-brand-text">תעודת סיום מוכרת</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <span className="text-brand-text">תמיכה אישית וליווי מקצועי</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <span className="text-brand-text">גישה לקהילת הלומדים הפרטית</span>
                  </div>
                  {product.duration && (
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-brand-accent flex-shrink-0" />
                      <span className="text-brand-text">משך זמן: {product.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <span className="text-brand-text">עדכונים לכל החיים</span>
                  </div>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brand-text">
                    <Tag className="h-5 w-5 text-brand-accent" />
                    למי מתאים המוצר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-brand-text">יזמים ובעלי עסקים שרוצים לשלב AI בעסק</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-brand-text">אנשי מקצוע המעוניינים להתעדכן בטכנולוגיות חדשות</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-brand-text">סטודנטים ואנשים המתחילים את דרכם בתחום</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-brand-text">כל מי שמעוניין להבין את עולם הבינה המלאכותית</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Key Benefits */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-brand-text">
                    למה לבחור במוצר הזה?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-text font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-text mb-1">מעשי ויישומי</h4>
                      <p className="text-brand-text-secondary">כל מה שתלמד תוכל ליישם מיידית בעבודה או בפרויקטים שלך</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-text font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-text mb-1">מעודכן וקדימה</h4>
                      <p className="text-brand-text-secondary">התכנים מתעדכנים בקביעות להתאים לטכנולוגיות החדשות ביותר</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-text font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-text mb-1">ליווי אישי</h4>
                      <p className="text-brand-text-secondary">קבל תמיכה ומענה לשאלות במהלך כל התהליך</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Linked Courses Section */}
              {linkedCourses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      הקורסים הכלולים במוצר זה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {linkedCourses.map((course) => (
                      <div key={course.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium">{course.title}</h4>
                          {course.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {course.description}
                            </p>
                          )}
                          {course.duration && (
                            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              משך: {course.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              {product.description && (
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle className="text-brand-text">תיאור מפורט</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate max-w-none text-brand-text">
                      {product.description.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Testimonials Section */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-brand-text">מה אומרים עלינו</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-r-4 border-brand-accent pr-4">
                    <p className="text-brand-text mb-3 italic">
                      "הקורס שינה לי את הדרך להסתכל על הבינה המלאכותית. המידע מעשי ושימושי מאוד!"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                        <span className="text-brand-text font-bold text-sm">ש</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text">שרה כהן</p>
                        <p className="text-sm text-brand-text-secondary">מנהלת שיווק</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-r-4 border-brand-accent pr-4">
                    <p className="text-brand-text mb-3 italic">
                      "המרצה מסביר בצורה ברורה ומעניינת. הצלחתי ליישם את מה שלמדתי מיד בעבודה."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                        <span className="text-brand-text font-bold text-sm">ד</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text">דני לוי</p>
                        <p className="text-sm text-brand-text-secondary">מפתח תוכנה</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-r-4 border-brand-accent pr-4">
                    <p className="text-brand-text mb-3 italic">
                      "השקעה שמשתלמת! המידע עדכני והכלים שלמדתי עוזרים לי כל יום."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                        <span className="text-brand-text font-bold text-sm">מ</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text">מיכל אברמוביץ'</p>
                        <p className="text-sm text-brand-text-secondary">יועצת עסקית</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Final CTA */}
              <Card className="modern-card border-2 border-brand-accent bg-gradient-to-br from-brand-background to-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-brand-text mb-4">
                    מוכן להתחיל את המסע?
                  </h3>
                  <p className="text-brand-text-secondary mb-6">
                    הצטרף אלינו עוד היום והתחל לפתח את הכישורים שלך בבינה מלאכותית
                  </p>
                  <Button
                    onClick={handlePurchase}
                    className="premium-button-primary text-xl px-12 py-4"
                    size="lg"
                    disabled={purchasing}
                  >
                    {purchasing ? 'מעבד...' : product.price > 0 ? `רכישה ב-₪${product.price.toLocaleString()}` : 'התחל עכשיו חינם'}
                  </Button>
                  {!user && (
                    <p className="text-brand-text-secondary mt-4">
                      נדרשת התחברות לרכישה
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;