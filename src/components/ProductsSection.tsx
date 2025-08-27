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
          <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'course':
        return (
          <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'consultation':
        return (
          <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <section id="events" className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight hebrew-mobile-wrap">
              <span className="text-[#eec643] font-bold">האירועים הקרובים:</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="premium-card p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-700 rounded mb-6"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight hebrew-mobile-wrap">
            <span className="text-[#eec643] font-bold">האירועים הקרובים:</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="premium-card p-6 relative group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#eec643]/10 via-transparent to-[#eec643]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-[#eec643]/10 rounded-full border border-[#eec643]/20">
                    {getProductIcon(product.product_type)}
                  </div>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-snug hebrew-mobile-wrap">
                  {product.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed hebrew-mobile-wrap text-sm md:text-base">
                  {getProductMessage(product.product_type)}
                </p>

                {product.price > 0 && (
                  <div className="mb-4 text-[#eec643] font-semibold text-lg">
                    ₪{product.price.toLocaleString()}
                  </div>
                )}
                
                <Link
                  to={product.external_url || `/products/${product.id}`}
                  className="inline-flex items-center gap-2 text-[#eec643] hover:text-white transition-colors duration-200 font-medium"
                >
                  למד עוד
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg hebrew-mobile-wrap">
              אין אירועים מתוכננים כרגע. בקרו בקרוב לעדכונים!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;