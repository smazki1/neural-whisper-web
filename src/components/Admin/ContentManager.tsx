import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import RichTextEditor from '@/components/blog/RichTextEditor';
import { ImageUpload } from '@/components/blog/ImageUpload';
import { SEOHead } from '@/components/SEO/SEOHead';
import { 
  FileText, 
  Image, 
  Calendar as CalendarIcon, 
  Eye, 
  Save, 
  Trash2, 
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Globe,
  Clock,
  Upload,
  ExternalLink,
  Hash,
  AlignLeft,
  Type,
  Link,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category_id?: string;
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface ContentManagerProps {
  onPostCreated?: () => void;
  onPostUpdated?: () => void;
}

export const ContentManager = ({ onPostCreated, onPostUpdated }: ContentManagerProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [seoPreview, setSeoPreview] = useState(false);
  const [autosaveTimer, setAutosaveTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const analytics = useAnalytics();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category_id: '',
    is_published: false,
    published_at: '',
    meta_title: '',
    meta_description: '',
    tags: [] as string[]
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && selectedPost && formData.title && formData.content) {
      if (autosaveTimer) {
        clearTimeout(autosaveTimer);
      }
      
      const timer = setTimeout(() => {
        autosave();
      }, 30000); // Auto-save every 30 seconds
      
      setAutosaveTimer(timer);
    }
    
    return () => {
      if (autosaveTimer) {
        clearTimeout(autosaveTimer);
      }
    };
  }, [formData, isEditing, selectedPost]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת הפוסטים",
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !selectedPost ? generateSlug(title) : prev.slug,
      meta_title: !prev.meta_title ? title : prev.meta_title
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      excerpt: !prev.excerpt ? content.substring(0, 160) : prev.excerpt
    }));
  };

  const autosave = async () => {
    if (!selectedPost || !formData.title || !formData.content) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPost.id);

      if (error) throw error;

      // Show subtle autosave indicator
      toast({
        title: "נשמר אוטומטית",
        description: "הטיוטה נשמרה אוטומטית",
        duration: 2000
      });
    } catch (error) {
      console.error('Autosave error:', error);
    }
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    
    try {
      const postData = {
        ...formData,
        category_id: formData.category_id || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        published_at: publish && !formData.published_at 
          ? new Date().toISOString() 
          : (formData.published_at || null),
        is_published: publish || formData.is_published,
        updated_at: new Date().toISOString()
      };

      let result;

      if (selectedPost) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', selectedPost.id)
          .select()
          .single();
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            author_id: (await supabase.auth.getUser()).data.user?.id!
          }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Track analytics
      analytics.trackEvent({
        action: selectedPost ? 'blog_post_updated' : 'blog_post_created',
        category: 'admin',
        label: formData.title
      });

      toast({
        title: "הצלחה",
        description: selectedPost ? "הפוסט עודכן בהצלחה" : "הפוסט נוצר בהצלחה",
      });

      await fetchPosts();
      setIsEditing(false);
      setSelectedPost(null);
      resetForm();

      if (selectedPost) {
        onPostUpdated?.();
      } else {
        onPostCreated?.();
      }

    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת הפוסט",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      analytics.trackEvent({
        action: 'blog_post_deleted',
        category: 'admin'
      });

      toast({
        title: "הצלחה",
        description: "הפוסט נמחק בהצלחה",
      });

      await fetchPosts();
      setIsEditing(false);
      setSelectedPost(null);
      resetForm();

    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת הפוסט",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      category_id: '',
      is_published: false,
      published_at: '',
      meta_title: '',
      meta_description: '',
      tags: []
    });
    setSelectedPost(null);
  };

  const startEditing = (post?: BlogPost) => {
    if (post) {
      setSelectedPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        featured_image_url: post.featured_image_url || '',
        category_id: post.category_id || '',
        is_published: post.is_published,
        published_at: post.published_at || '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        tags: post.tags || []
      });
    } else {
      resetForm();
    }
    setIsEditing(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && post.is_published) ||
                         (filterStatus === 'draft' && !post.is_published);
    
    return matchesSearch && matchesFilter;
  });

  const getSEOScore = () => {
    let score = 0;
    if (formData.title && formData.title.length >= 30 && formData.title.length <= 60) score += 25;
    if (formData.meta_description && formData.meta_description.length >= 120 && formData.meta_description.length <= 160) score += 25;
    if (formData.featured_image_url) score += 25;
    if (formData.tags.length >= 3) score += 25;
    return score;
  };

  if (loading) {
    return <div className="p-6">טוען...</div>;
  }

  return (
    <div className="space-y-6">
      {isEditing ? (
        // Editor View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {selectedPost ? 'עריכת פוסט' : 'פוסט חדש'}
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setSeoPreview(!seoPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                תצוגה מקדימה SEO
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                ביטול
              </Button>
              <Button 
                onClick={() => handleSave(false)} 
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'שומר...' : 'שמור טיוטה'}
              </Button>
              <Button 
                onClick={() => handleSave(true)} 
                disabled={saving}
                className="bg-primary"
              >
                <Globe className="h-4 w-4 mr-2" />
                פרסם
              </Button>
            </div>
          </div>

          {seoPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  תצוגה מקדימה SEO (ציון: {getSEOScore()}/100)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                      {formData.meta_title || formData.title || 'כותרת הפוסט'}
                    </div>
                    <div className="text-green-700 text-sm">
                      https://ai-master.co.il/blog/{formData.slug}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {formData.meta_description || formData.excerpt || 'תיאור הפוסט יופיע כאן...'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="title">כותרת</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="הכנס כותרת..."
                      className="text-lg font-medium"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="post-slug"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">תקציר</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="תקציר קצר של הפוסט..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>תוכן</Label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="כתוב את תוכן הפוסט כאן..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">פרסום</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_published">פרסום מיידי</Label>
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, is_published: checked }))
                      }
                    />
                  </div>

                  <div>
                    <Label>תאריך פרסום</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: he }) : "בחר תאריך"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="category">קטגוריה</Label>
                    <Select 
                      value={formData.category_id} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">תמונה ראשית</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={formData.featured_image_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
                  />
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meta_title">כותרת SEO</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="כותרת אופטימלית למנועי חיפוש"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {formData.meta_title.length}/60
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="meta_description">תיאור SEO</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="תיאור אופטימלי למנועי חיפוש"
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {formData.meta_description.length}/160
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">תגיות</Label>
                    <Input
                      id="tags"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      }))}
                      placeholder="תגית1, תגית2, תגית3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {selectedPost && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">פעולות מסוכנות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          מחק פוסט
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                          <AlertDialogDescription>
                            פעולה זו תמחק את הפוסט לצמיתות ולא ניתן לבטלה.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ביטול</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(selectedPost.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            מחק
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      ) : (
        // List View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">ניהול תוכן</h2>
            <Button onClick={() => startEditing()}>
              <Plus className="h-4 w-4 mr-2" />
              פוסט חדש
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="חפש פוסטים..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הפוסטים</SelectItem>
                    <SelectItem value="published">פורסמו</SelectItem>
                    <SelectItem value="draft">טיוטות</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <Badge variant={post.is_published ? "default" : "secondary"}>
                          {post.is_published ? 'פורסם' : 'טיוטה'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: he })}
                        </span>
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: he })}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {post.tags.slice(0, 3).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        צפה
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startEditing(post)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        ערוך
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPosts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">אין פוסטים</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'לא נמצאו פוסטים התואמים לחיפוש'
                      : 'עדיין לא נוצרו פוסטים'
                    }
                  </p>
                  <Button onClick={() => startEditing()}>
                    <Plus className="h-4 w-4 mr-2" />
                    צור פוסט ראשון
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};