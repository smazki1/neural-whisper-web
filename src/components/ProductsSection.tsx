import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock } from 'lucide-react';
import productImageFallback from '@/assets/hero-bg-ai-modern.jpg';
import { resolveProductImageUrl } from '@/lib/productImage.js';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  category: 'advanced' | 'basic' | 'business';
  product_type: 'course' | 'workshop' | 'consultation';
  duration: string | null;
  thumbnail_url: string | null;
  external_url: string | null;
  is_published: boolean;
  is_featured: boolean;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
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

  const getTypeLabel = (productType: string) => {
    const labels = {
      course: 'קורס',
      workshop: 'סדנה',
      consultation: 'ייעוץ',
      lecture: 'הרצאה'
    };
    return labels[productType as keyof typeof labels] || productType;
  };

  if (loading) {
    return (
      <section id="events" className="py-16 md:py-20 font-heebo professional-section-alt" dir="rtl">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold professional-text-primary mb-6 leading-tight hebrew-mobile-wrap">
              <span className="professional-text-accent font-bold">אירועים ומוצרים</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="professional-card p-6 animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded mb-6"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 md:py-20 font-heebo professional-section-bg" dir="rtl">
      <div className="section-divider"></div>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold professional-text-primary mb-6 leading-tight hebrew-mobile-wrap">
            <span className="professional-text-accent font-bold">אירועים ומוצרים</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="modern-card overflow-hidden hover:shadow-xl transition-all duration-500 group h-full">
                {product.thumbnail_url && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={resolveProductImageUrl(product.thumbnail_url, productImageFallback)}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {product.is_featured && (
                      <Badge className="absolute top-4 right-4 bg-brand-accent text-brand-text font-medium px-3 py-1">
                        מומלץ
                      </Badge>
                    )}
                    <div className="absolute bottom-4 right-4 left-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {getCategoryLabel(product.category)}
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                          {getTypeLabel(product.product_type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <CardTitle className="text-2xl font-bold text-brand-text mb-3 group-hover:text-brand-accent transition-colors duration-300">
                    {product.title}
                  </CardTitle>
                  
                  {product.short_description && (
                    <p className="text-brand-text-secondary mb-4 leading-relaxed">
                      {product.short_description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    {product.duration && (
                      <div className="flex items-center gap-2 text-brand-text-secondary">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{product.duration}</span>
                      </div>
                    )}
                    
                    <div className="text-3xl font-bold text-brand-accent">
                      {product.price > 0 ? `₪${product.price.toLocaleString()}` : 'חינם'}
                    </div>
                  </div>

                  {product.external_url ? (
                    <a href={product.external_url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="premium-button-primary w-full" size="lg">
                        למידע נוסף
                      </Button>
                    </a>
                  ) : (
                    <Link to={`/products/${product.slug}`} className="block">
                      <Button className="premium-button-primary w-full" size="lg">
                        למידע נוסף
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="professional-text-muted text-lg hebrew-mobile-wrap">
              אין אירועים או מוצרים זמינים כרגע. בקרו בקרוב לעדכונים!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
