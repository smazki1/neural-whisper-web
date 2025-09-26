import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Search, Clock, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  external_url: string;
  is_featured: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, typeFilter]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(product => product.product_type === typeFilter);
    }

    setFilteredProducts(filtered);
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
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>מוצרים וקורסים | AI Master</title>
        <meta name="description" content="גלה את מגוון הקורסים והסדנאות שלנו בתחום הבינה המלאכותית - מבסיסי ועד מתקדם" />
        <meta name="keywords" content="AI, בינה מלאכותית, קורסים, סדנאות, למידה" />
      </Helmet>

      <div className="min-h-screen bg-background pt-20" dir="rtl">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-text mb-4">
              המוצרים והשירותים שלנו
            </h1>
            <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
              גלה את מגוון הקורסים, הסדנאות והייעוצים שלנו בתחום הבינה המלאכותית - מבסיסי ועד מתקדם
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש מוצרים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="basic">בסיסי</SelectItem>
                <SelectItem value="advanced">מתקדם</SelectItem>
                <SelectItem value="business">עסקי</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Tag className="h-4 w-4 ml-2" />
                <SelectValue placeholder="סוג המוצר" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסוגים</SelectItem>
                <SelectItem value="course">קורסים</SelectItem>
                <SelectItem value="workshop">סדנאות</SelectItem>
                <SelectItem value="consultation">ייעוץ</SelectItem>
                <SelectItem value="lecture">הרצאות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-brand-text mb-2">
                לא נמצאו מוצרים
              </h3>
              <p className="text-brand-text-secondary">
                נסה לשנות את קריטריוני החיפוש או הפילטרים
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="modern-card overflow-hidden hover:shadow-xl transition-all duration-500 group">
                  {product.thumbnail_url && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.thumbnail_url}
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
                          למד עוד
                        </Button>
                      </a>
                    ) : (
                      <Link to={`/products/${product.slug}`} className="block">
                        <Button className="premium-button-primary w-full" size="lg">
                          למד עוד
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;