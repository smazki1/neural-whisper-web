import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArticleSchema } from '@/components/SEO/ArticleSchema';
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
import { sanitizeHtml } from '@/lib/sanitizeHtml.js';

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
    job_title: string | null;
    avatar_url: string | null;
    author_bio: string | null;
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
    if (!slug) return;

    setLoading(true);
    try {
      // Fetch blog post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (postError) {
        if (postError.code === 'PGRST116') {
          navigate('/404');
          return;
        }
        throw postError;
      }

      // Fetch author profile separately
      if (postData.author_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name, job_title, avatar_url, author_bio')
          .eq('id', postData.author_id)
          .single();

        setPost({
          ...postData,
          profiles: profileData
        });
      } else {
        setPost({
          ...postData,
          profiles: null
        });
      }
      
      // Fetch related posts
      if (postData.category_id) {
        fetchRelatedPosts(postData.category_id, postData.id);
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
        <link rel="canonical" href={`https://aimaster-site.lovable.app/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={`https://aimaster-site.lovable.app/blog/${post.slug}`} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        {post.categories && (
          <meta property="article:section" content={post.categories.name} />
        )}
      </Helmet>
      
      <ArticleSchema 
        article={{
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || undefined,
          slug: post.slug,
          published_at: post.published_at || post.created_at,
          created_at: post.created_at,
          featured_image_url: post.featured_image_url || undefined,
          category: post.categories?.name
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar onContactClick={() => {}} />
        
        <article className="container mx-auto px-6 py-8 pt-32 max-w-4xl" dir="rtl">
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
            
            <h1 className="text-3xl md:text-5xl font-bold text-brand-text mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-brand-text-secondary mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {post.profiles?.avatar_url ? (
                    <img 
                      src={post.profiles.avatar_url} 
                      alt={post.profiles.display_name || 'Author'} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <User className="h-4 w-4 text-background" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-brand-text">
                    {post.profiles?.display_name || 'AI Master'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.published_at)}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
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
            className="prose prose-lg max-w-none mb-12 
              [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-8 [&>h1]:text-brand-text [&>h1]:leading-tight
              [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mb-5 [&>h2]:mt-7 [&>h2]:text-brand-text [&>h2]:leading-snug
              [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mb-4 [&>h3]:mt-6 [&>h3]:text-brand-text
              [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mb-3 [&>h4]:mt-5 [&>h4]:text-brand-text
              [&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:text-brand-text
              [&>strong]:font-bold [&>strong]:text-brand-text
              [&>em]:italic
              [&>ul]:list-disc [&>ul]:mr-6 [&>ul]:mb-4 [&>ul]:text-brand-text
              [&>ol]:list-decimal [&>ol]:mr-6 [&>ol]:mb-4 [&>ol]:text-brand-text
              [&>li]:text-lg [&>li]:mb-2 [&>li]:text-brand-text
              [&>blockquote]:border-r-4 [&>blockquote]:border-accent [&>blockquote]:pr-4 [&>blockquote]:py-2 [&>blockquote]:mb-4 [&>blockquote]:italic [&>blockquote]:text-brand-text-secondary
              [&>a]:text-accent [&>a]:font-medium [&>a]:underline [&>a:hover]:text-accent/80
              [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm
              [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:mb-4 [&>pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            dir="rtl"
          />

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-lg font-semibold text-brand-text">שתף את המאמר:</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                  window.open(shareUrl, '_blank', 'width=600,height=400');
                }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
                  window.open(shareUrl, '_blank', 'width=600,height=400');
                }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                  window.open(shareUrl, '_blank', 'width=600,height=400');
                }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                העתק קישור
              </Button>
            </div>
          </div>

          {/* Author Bio Section */}
          {post.profiles && (post.profiles.author_bio || post.profiles.display_name) && (
            <div className="premium-card p-8 mb-12">
              <div className="flex items-start gap-6">
                {post.profiles.avatar_url ? (
                  <img 
                    src={post.profiles.avatar_url} 
                    alt={post.profiles.display_name || 'Author'} 
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center flex-shrink-0">
                    <User className="w-10 h-10 text-background" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-brand-text mb-2">
                    {post.profiles.display_name || 'AI Master'}
                  </h3>
                  {post.profiles.job_title && (
                    <p className="text-brand-accent font-medium mb-3">
                      {post.profiles.job_title}
                    </p>
                  )}
                  {post.profiles.author_bio && (
                    <p className="text-brand-text-secondary leading-relaxed">
                      {post.profiles.author_bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
