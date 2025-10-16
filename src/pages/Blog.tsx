import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Search, Filter, ArrowLeft, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  created_at: string;
  published_at: string;
  is_published: boolean;
  slug: string;
  featured_image_url: string | null;
  category_id: string | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  profiles?: {
    display_name: string | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת המאמרים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category_id === selectedCategory);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDate = (dateString: string) => {
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

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onContactClick={() => {}} />
        <div className="container mx-auto px-6 py-8 pt-32" dir="rtl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </CardContent>
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
        <title>בלוג - AI Master</title>
        <meta name="description" content="מאמרים, טיפים ותובנות מעולם הבינה המלאכותית והטכנולוgiה" />
        <meta property="og:title" content="בלוג - AI Master" />
        <meta property="og:description" content="מאמרים, טיפים ותובנות מעולם הבינה המלאכותית והטכנולוgiה" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar onContactClick={() => {}} />
        
        <div className="container mx-auto px-6 py-8 pt-32" dir="rtl">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-text mb-4">
              <span className="block mb-2">הבלוג שלנו</span>
              <span className="premium-accent-gradient">השראה ולמידה</span>
            </h1>
            <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto leading-relaxed">
              מאמרים, טיפים ותובנות מעולם הבינה המלאכותית, שיווק דיגיטלי ויזמות
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="premium-card p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-secondary" />
                  <Input
                    placeholder="חפש מאמרים..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-brand-text-secondary" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="כל הקטגוריות" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל הקטגוריות</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {(searchTerm || selectedCategory !== 'all') && (
                <div className="mt-4 flex items-center gap-2 text-sm text-brand-text-secondary">
                  <span>מוצגים {filteredPosts.length} מתוך {posts.length} מאמרים</span>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                    >
                      נקה סינונים
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Posts Grid */}
          {currentPosts.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="premium-card p-12 max-w-md mx-auto">
                <BookOpen className="h-16 w-16 mx-auto text-brand-accent mb-4" />
                <h3 className="text-2xl font-semibold text-brand-text mb-4">
                  {searchTerm || selectedCategory !== 'all' ? 'לא נמצאו מאמרים' : 'בקרוב...'}
                </h3>
                <p className="text-brand-text-secondary mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'נסה לשנות את מונחי החיפוש או הסינון'
                    : 'אנחנו עובדים על תוכן מעניין עבורכם. חזרו בקרוב!'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    הצג את כל המאמרים
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="premium-card group cursor-pointer overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      {/* Featured Image */}
                      <div className="aspect-video overflow-hidden bg-muted">
                        {post.featured_image_url ? (
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-brand-text-secondary" />
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Category Badge */}
                        {post.categories && (
                          <Badge 
                            variant="secondary" 
                            className="w-fit mb-3 bg-accent/10 text-accent border-accent/20"
                          >
                            {post.categories.name}
                          </Badge>
                        )}
                        
                        {/* Title */}
                        <h2 className="text-xl font-bold text-brand-text mb-3 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        
                        {/* Excerpt */}
                        <p className="text-brand-text-secondary mb-4 leading-relaxed line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-brand-text-secondary mt-auto pt-4 border-t border-border">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>אבי פריד</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(post.published_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{getReadingTime(post.content)}</span>
                          </div>
                        </div>
                        
                        {/* Read More */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-accent font-medium group-hover:underline">
                            קרא עוד →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex justify-center items-center gap-2 mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? "bg-accent text-background" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;