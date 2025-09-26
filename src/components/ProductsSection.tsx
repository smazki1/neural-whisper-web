import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
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

  const getProductMessage = (productType: string) => {
    const messages = {
      workshop: "בואו לחוות על בשרכם איך AI יכול לתת לכם תוצאה מוחשית בזמן אפסי. זו לא עוד הרצאה, זו חוויה שמשנה תפיסת עולם.",
      course: "התוכנית המלאה, צעד אחר צעד, שתיתן לכם את כל הידע, הכלים והביטחון להשתמש ב-AI בכל תחום בחיים המקצועיים והאישיים.",
      consultation: "כאן צוללים לעומק. נבנה יחד את האסטרטגיה האישית שלכם ונוודא שאתם לא רק לומדים, אלא מיישמים ומצליחים."
    };
    return messages[productType as keyof typeof messages] || "גלו איך AI יכול לשנות את המשחק עבורכם.";
  };

  const getProductIcon = (productType: string) => {
    switch (productType) {
      case 'workshop':
        return (
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'course':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'consultation':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <section id="events" className="modern-section modern-section-alt" dir="rtl">
        <div className="modern-container">
          <div className="text-center mb-16">
            <h2 className="modern-heading-2 mb-6 hebrew-mobile-wrap">
              <span className="modern-text-accent font-bold">האירועים הקרובים</span>
            </h2>
          </div>
          <div className="modern-grid-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="modern-card p-8 animate-pulse">
                <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-slate-200 rounded mb-3"></div>
                <div className="h-4 bg-slate-200 rounded mb-6"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="modern-section modern-section-alt" dir="rtl">      
      <div className="modern-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="modern-heading-2 mb-6 hebrew-mobile-wrap">
            <span className="modern-text-accent font-bold">האירועים הקרובים</span>
          </h2>
        </motion.div>

        <div className="modern-grid-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="modern-card p-8 group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    {getProductIcon(product.product_type)}
                  </div>
                </div>
                
                <h3 className="modern-heading-4 mb-4 hebrew-mobile-wrap">
                  {product.title}
                </h3>
                
                <p className="modern-body mb-8 hebrew-mobile-wrap">
                  {getProductMessage(product.product_type)}
                </p>

                {product.price > 0 && (
                  <div className="mb-6 modern-text-accent font-bold text-2xl">
                    ₪{product.price.toLocaleString()}
                  </div>
                )}
                
                <Link
                  to={product.external_url || `/products/${product.id}`}
                  className="modern-link font-semibold"
                >
                  למד עוד
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="modern-body-large modern-text-muted hebrew-mobile-wrap">
              אין אירועים מתוכננים כרגע. בקרו בקרוב לעדכונים!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;