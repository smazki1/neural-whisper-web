import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Calendar,
  User,
  FileText,
  Tag,
  Settings
} from 'lucide-react';

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
  updated_at: string;
  author_id: string;
  category_id: string | null;
  categories?: {
    name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchCategories();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name) {
      toast({
        title: "שגיאה",
        description: "יש למלא את שם הקטגוריה",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert([{
          name: categoryForm.name,
          slug: categoryForm.slug || generateSlug(categoryForm.name),
          description: categoryForm.description || null
        }]);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "קטגוריה חדשה נוצרה בהצלחה"
      });

      setCategoryDialogOpen(false);
      setCategoryForm({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה ביצירת הקטגוריה",
        variant: "destructive"
      });
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המאמר?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "המאמר נמחק בהצלחה"
      });

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת המאמר",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const updateData: any = { 
        is_published: !currentStatus 
      };
      
      if (!currentStatus) {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: `המאמר ${!currentStatus ? 'פורסם' : 'הוסר מהפרסום'} בהצלחה`
      });

      fetchPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון סטטוס המאמר",
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הקטגוריה?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "הקטגוריה נמחקה בהצלחה"
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת הקטגוריה",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">נדרשת התחברות</h2>
            <p className="text-muted-foreground mb-4">
              עליך להתחבר כדי לנהל מאמרים
            </p>
            <Button onClick={() => navigate('/auth')}>
              התחבר
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>ניהול מאמרים - AI Master</title>
        <meta name="description" content="ניהול וכתיבת מאמרים" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              ניהול מאמרים
            </h1>
            <p className="text-lg text-muted-foreground">
              יצירה, עריכה וניהול מאמרים וקטגוריות
            </p>
          </div>

          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                מאמרים
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                קטגוריות
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">המאמרים שלי</h2>
                  <Button 
                    onClick={() => navigate('/blog/editor')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    מאמר חדש
                  </Button>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">אין מאמרים עדיין</h3>
                      <p className="text-muted-foreground mb-4">התחל ביצירת המאמר הראשון שלך</p>
                      <Button onClick={() => navigate('/blog/editor')}>
                        <Plus className="h-4 w-4 ml-2" />
                        צור מאמר חדש
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{post.title}</h3>
                                <Badge variant={post.is_published ? "default" : "secondary"}>
                                  {post.is_published ? 'פורסם' : 'טיוטה'}
                                </Badge>
                                {post.categories && (
                                  <Badge variant="outline">
                                    {post.categories.name}
                                  </Badge>
                                )}
                              </div>
                              
                              {post.excerpt && (
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {post.excerpt}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  עודכן: {formatDate(post.updated_at)}
                                </span>
                                {post.published_at && (
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    פורסם: {formatDate(post.published_at)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => togglePublished(post.id, post.is_published)}
                              >
                                {post.is_published ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/blog/editor/${post.id}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">ניהול קטגוריות</h2>
                  <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        קטגוריה חדשה
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>יצירת קטגוריה חדשה</DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="category-name">שם הקטגוריה *</Label>
                          <Input
                            id="category-name"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({
                              ...categoryForm, 
                              name: e.target.value,
                              slug: generateSlug(e.target.value)
                            })}
                            placeholder="שם הקטגוריה"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="category-slug">Slug</Label>
                          <Input
                            id="category-slug"
                            value={categoryForm.slug}
                            onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                            placeholder="category-slug"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="category-description">תיאור</Label>
                          <Textarea
                            id="category-description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                            placeholder="תיאור הקטגוריה"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            צור קטגוריה
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setCategoryDialogOpen(false)}
                          >
                            ביטול
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {categories.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">אין קטגוריות עדיין</h3>
                      <p className="text-muted-foreground mb-4">התחל ביצירת הקטגוריה הראשונה</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card key={category.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            /{category.slug}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {category.description && (
                            <p className="text-sm text-muted-foreground mb-4">
                              {category.description}
                            </p>
                          )}
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default BlogManager;