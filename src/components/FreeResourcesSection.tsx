import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const tagColors = {
  'חדש': 'bg-blue-500/20 text-blue-300',
  'פופולרי': 'bg-emerald-500/20 text-emerald-300',
  'בלעדי': 'bg-purple-500/20 text-purple-300',
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string | null;
  featured_image_url: string | null;
  tags: string[] | null;
}

const FreeResourcesSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, slug, published_at, featured_image_url, tags')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6);

      if (data) {
        setBlogPosts(data);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden professional-section-bg" dir="rtl">
      <div className="section-divider"></div>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="block professional-text-primary">מרחבי השראה ולימוד</span>
          </motion.h2>
        </motion.div>

        {/* Blog Posts Grid */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl professional-text-muted">בקרוב...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogPosts.map((post, index) => {
            const mainTag = post.tags?.[0] || 'חדש';
            const tagColor = tagColors[mainTag as keyof typeof tagColors] || tagColors['חדש'];
            const publishedDate = post.published_at 
              ? new Date(post.published_at).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
              : 'זמין כעת';
            
            return (
              <motion.div
                key={post.id}
                className="relative"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <a 
                  href={`/blog/${post.slug}`}
                  className="block professional-card p-8 lg:p-10 h-full relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  {/* Featured Image */}
                  {post.featured_image_url && (
                    <div className="relative mb-6 -mx-8 -mt-8 lg:-mx-10 lg:-mt-10">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.featured_image_url} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="relative mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <p className="professional-text-muted text-sm font-medium">מאמר</p>
                        {post.tags && post.tags.length > 0 && (
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${tagColor}`}>
                            {mainTag}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-6">
                    <h3 className="text-2xl lg:text-2xl font-bold professional-text-primary leading-tight">
                      {post.title}
                    </h3>
                    
                    {post.excerpt && (
                      <p className="professional-text-body text-base leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-brand-text/10">
                      <span className="professional-text-muted text-sm">{publishedDate}</span>
                      <div className="flex items-center gap-2 professional-text-accent font-medium">
                        <span className="text-sm">קרא עוד</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FreeResourcesSection;