import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Eye, 
  ArrowRight, 
  Image as ImageIcon,
  Upload,
  X,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Type,
  AlignRight,
  AlignCenter,
  AlignLeft
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

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
}

const BlogEditor = () => {
  const { postId } = useParams<{ postId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category_id: '',
    is_published: false
  });

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

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

  const fetchPost = async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || '',
        featured_image_url: data.featured_image_url || '',
        category_id: data.category_id || '',
        is_published: data.is_published
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת המאמר",
        variant: "destructive"
      });
      navigate('/blog/manager');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: postId ? formData.slug : generateSlug(title)
    });
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setFormData({
        ...formData,
        content: contentRef.current.innerHTML
      });
    }
  };

  const insertFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
    handleContentChange();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        insertFormatting('insertImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "שגיאה",
        description: "יש למלא כותרת ותוכן",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || null,
        featured_image_url: formData.featured_image_url || null,
        category_id: formData.category_id || null,
        is_published: publish || formData.is_published,
        ...(publish && !postId && { published_at: new Date().toISOString() }),
        ...(publish && postId && !formData.is_published && { published_at: new Date().toISOString() })
      };

      if (postId) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            author_id: user?.id
          }]);

        if (error) throw error;
      }

      toast({
        title: "הצלחה!",
        description: publish ? "המאמר פורסם בהצלחה" : "המאמר נשמר בהצלחה"
      });

      navigate('/blog/manager');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת המאמר",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">נדרשת התחברות</h2>
            <p className="text-muted-foreground mb-4">
              עליך להתחבר כדי לערוך מאמרים
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
        <title>{postId ? 'עריכת מאמר' : 'מאמר חדש'} - AI Master</title>
        <meta name="description" content={postId ? 'עריכת מאמר קיים' : 'יצירת מאמר חדש'} />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog/manager')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              חזור לניהול מאמרים
            </Button>
            <h1 className="text-3xl font-bold">
              {postId ? 'עריכת מאמר' : 'מאמר חדש'}
            </h1>
          </div>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Editor */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>פרטי המאמר</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">כותרת המאמר *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="כותרת מעניינת למאמר"
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        placeholder="url-friendly-slug"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">תקציר</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        placeholder="תקציר קצר של המאמר"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Rich Text Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle>תוכן המאמר</CardTitle>
                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/50">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('bold')}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('italic')}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('insertUnorderedList')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const url = prompt('הכנס קישור:');
                          if (url) insertFormatting('createLink', url);
                        }}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('formatBlock', 'h2')}
                      >
                        <Type className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('justifyRight')}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('justifyCenter')}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('justifyLeft')}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      ref={contentRef}
                      contentEditable
                      onInput={handleContentChange}
                      className="min-h-[400px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary prose prose-lg max-w-none"
                      style={{ direction: 'rtl' }}
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>הגדרות פרסום</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">קטגוריה</Label>
                      <Select 
                        value={formData.category_id} 
                        onValueChange={(value) => setFormData({...formData, category_id: value})}
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

                    <div>
                      <Label htmlFor="featured_image">תמונה ראשית (URL)</Label>
                      <Input
                        id="featured_image"
                        value={formData.featured_image_url}
                        onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                      />
                      <Label htmlFor="is_published">פורסם</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>פעולות</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => handleSave(false)} 
                      disabled={saving}
                      className="w-full"
                      variant="outline"
                    >
                      <Save className="h-4 w-4 ml-2" />
                      {saving ? 'שומר...' : 'שמור כטיוטה'}
                    </Button>
                    
                    <Button 
                      onClick={() => handleSave(true)} 
                      disabled={saving}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 ml-2" />
                      {saving ? 'מפרסם...' : 'פרסם מאמר'}
                    </Button>

                    {formData.is_published && formData.slug && (
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 ml-2" />
                        צפה במאמר
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogEditor;