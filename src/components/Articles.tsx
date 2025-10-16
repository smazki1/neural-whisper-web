import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  categories?: {
    name: string;
  } | null;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          categories (
            name
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 font-heebo premium-section" dir="rtl">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold premium-text-gradient mb-6">
              תובנות ומדריכים
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="premium-card p-6">
                <Skeleton className="h-6 w-20 mb-4" />
                <Skeleton className="h-8 w-full mb-3" />
                <Skeleton className="h-16 w-full mb-6" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="py-16 md:py-20 font-heebo premium-section" dir="rtl">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold premium-text-gradient mb-6">
              תובנות ומדריכים
            </h2>
          </div>
          <div className="premium-card p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-accent/50" />
            <h3 className="text-xl font-bold mb-2">בקרוב...</h3>
            <p className="text-muted-foreground">
              מאמרים חדשים בדרך אליכם
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 font-heebo premium-section" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold premium-text-gradient mb-6 leading-tight hebrew-mobile-wrap">
            תובנות ומדריכים
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="premium-card p-6 group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full border border-accent/20">
                  {article.categories?.name || 'מאמר'}
                </span>
              </div>
              
              <h3 className="text-lg md:text-xl font-bold mb-3 leading-snug hebrew-mobile-wrap">
                {article.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed hebrew-mobile-wrap">
                {article.excerpt || 'קרא עוד כדי לגלות תובנות חשובות בעולם הבינה המלאכותית'}
              </p>
              
              <Link
                to={`/blog/${article.slug}`}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors duration-200 font-semibold premium-button-link"
              >
                קרא עוד
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;