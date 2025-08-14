import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  User,
  ArrowRight,
  Clock,
  Tag,
  Share2,
  BookOpen
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  author_id: string;
  category_id: string | null;
  categories?: {
    name: string;
    slug: string;
  } | null;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          categories (
            name,
            slug
          ),
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          navigate('/404');
          return;
        }
        throw error;
      }

      setPost(data as any);
      
      // Fetch related posts
      if (data.category_id) {
        fetchRelatedPosts(data.category_id, data.id);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת המאמר",
        variant: "destructive"
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (categoryId: string, currentPostId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image_url, published_at')
        .eq('category_id', categoryId)
        .eq('is_published', true)
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} דקות קריאה`;
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "הקישור הועתק",
        description: "הקישור הועתק ללוח"
      });
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <Navbar onContactClick={() => {}} />
          <div className="container mx-auto px-6 py-8 pt-28 max-w-4xl">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <Navbar onContactClick={() => {}} />
          <div className="container mx-auto px-6 py-8 pt-28">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">מאמר לא נמצא</h3>
                <p className="text-muted-foreground mb-4">המאמר שחיפשת לא קיים או הוסר</p>
                <Button onClick={() => navigate('/blog')}>
                  חזור למאמרים
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - AI Master</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        {post.categories && (
          <meta property="article:section" content={post.categories.name} />
        )}
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar onContactClick={() => {}} />
        
        <article className="container mx-auto px-6 py-8 pt-28 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/blog')}>
              מאמרים
            </Button>
            <ArrowRight className="h-3 w-3 rotate-180" />
            {post.categories && (
              <>
                <span>{post.categories.name}</span>
                <ArrowRight className="h-3 w-3 rotate-180" />
              </>
            )}
            <span className="text-foreground">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            {post.categories && (
              <Badge variant="secondary" className="flex items-center gap-1 w-fit mb-4">
                <Tag className="h-3 w-3" />
                {post.categories.name}
              </Badge>
            )}
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {post.profiles?.avatar_url ? (
                    <img 
                      src={post.profiles.avatar_url} 
                      alt={post.profiles.display_name || 'כותב'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {post.profiles?.display_name || 'כותב אנונימי'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.published_at)}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {getReadingTime(post.content)}
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 ml-2" />
                שתף
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8 aspect-video rounded-lg overflow-hidden">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12 [&>*]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
            dir="rtl"
          />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">מאמרים קשורים</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div onClick={() => navigate(`/blog/${relatedPost.slug}`)}>
                      {relatedPost.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={relatedPost.featured_image_url} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        
                        {relatedPost.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
                            {relatedPost.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(relatedPost.published_at)}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </article>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;