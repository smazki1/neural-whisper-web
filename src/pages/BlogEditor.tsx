import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/blog/RichTextEditor';
import { ImageUpload } from '@/components/blog/ImageUpload';
import { TagSelector } from '@/components/blog/TagSelector';
import { 
  Save, 
  Eye, 
  ArrowRight, 
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  FileText,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category_id: '',
    is_published: false,
    meta_description: '',
    meta_keywords: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCategories();
    if (postId) {
      fetchPost();
    }
  }, [postId, user]);

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
        is_published: data.is_published,
        meta_description: '',
        meta_keywords: ''
      });

      if (data.published_at) {
        setScheduledDate(new Date(data.published_at));
      }

      // Fetch post tags
      const { data: postTags, error: tagsError } = await supabase
        .from('blog_post_tags')
        .select('tag_id')
        .eq('post_id', postId);

      if (!tagsError && postTags) {
        setSelectedTags(postTags.map(pt => pt.tag_id));
      }
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

  const handleSave = async (publish: boolean = false, scheduled: boolean = false) => {
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
      const now = new Date().toISOString();
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || null,
        featured_image_url: formData.featured_image_url || null,
        category_id: formData.category_id && formData.category_id.trim() !== '' ? formData.category_id : null,
        is_published: publish || formData.is_published,
        meta_title: formData.meta_description || null,
        meta_description: formData.meta_description || null,
        ...(publish && !postId && { published_at: scheduled && scheduledDate ? scheduledDate.toISOString() : now }),
        ...(publish && postId && !formData.is_published && { published_at: scheduled && scheduledDate ? scheduledDate.toISOString() : now })
      };

      let savedPostId: string | undefined = postId;

      if (postId) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);

        if (error) throw error;

        // Delete existing tags for update
        const { error: deleteError } = await supabase
          .from('blog_post_tags')
          .delete()
          .eq('post_id', postId);

        if (deleteError) console.error('Error deleting tags:', deleteError);
      } else {
        // Create new post - get default author or use current user
        let authorId = user?.id;
        
        // Try to get default author from site settings
        const { data: defaultAuthor } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'default_author_id')
          .single();
        
        if (defaultAuthor?.setting_value) {
          authorId = defaultAuthor.setting_value;
        }

        const { data: newPost, error } = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            author_id: authorId
          }])
          .select('id')
          .single();

        if (error) throw error;
        if (!newPost?.id) throw new Error('Failed to create post');
        
        savedPostId = newPost.id;
      }

      // Insert tags
      if (savedPostId && selectedTags.length > 0) {
        const tagInserts = selectedTags.map(tagId => ({
          post_id: savedPostId!,
          tag_id: tagId
        }));

        const { error: tagsError } = await supabase
          .from('blog_post_tags')
          .insert(tagInserts);

        if (tagsError) console.error('Error inserting tags:', tagsError);
      }

      toast({
        title: "הצלחה!",
        description: scheduled ? "המאמר תוזמן לפרסום" : publish ? "המאמר פורסם בהצלחה" : "המאמר נשמר בהצלחה"
      });

      navigate('/blog/manager');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "שגיאה",
        description: error.message || "שגיאה בשמירת המאמר",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="premium-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4 text-brand-text">נדרשת התחברות</h2>
            <p className="text-brand-text-secondary mb-4">
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
        <div className="container mx-auto px-6 py-8 pt-32">
          {/* Header */}
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog/manager')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              חזור לניהול מאמרים
            </Button>
            <h1 className="text-3xl font-bold text-brand-text">
              {postId ? 'עריכת מאמר' : 'מאמר חדש'}
            </h1>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Details Card */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brand-text">
                    <FileText className="h-5 w-5" />
                    פרטי המאמר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-brand-text">כותרת המאמר *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="כותרת מעניינת למאמר"
                      className="text-lg mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug" className="text-brand-text">Slug (כתובת URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="url-friendly-slug"
                      className="mt-2"
                    />
                    <p className="text-sm text-brand-text-secondary mt-1">
                      הכתובת תהיה: /blog/{formData.slug}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="excerpt" className="text-brand-text">תקציר המאמר</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="תקציר קצר ומעניין שיעודד קריאה"
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-brand-text">תוכן המאמר</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value})}
                    placeholder="התחל לכתוב את המאמר שלך..."
                  />
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brand-text">
                    <Globe className="h-5 w-5" />
                    הגדרות SEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meta_description" className="text-brand-text">תיאור META</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      placeholder="תיאור קצר למנועי החיפוש (עד 160 תווים)"
                      maxLength={160}
                      rows={2}
                      className="mt-2"
                    />
                    <p className="text-xs text-brand-text-secondary mt-1">
                      {formData.meta_description.length}/160 תווים
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="meta_keywords" className="text-brand-text">מילות מפתח</Label>
                    <Input
                      id="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                      placeholder="מילות מפתח מופרדות בפסיקים"
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Settings */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brand-text">
                    <Settings className="h-5 w-5" />
                    הגדרות פרסום
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category" className="text-brand-text">קטגוריה</Label>
                    <Select 
                      value={formData.category_id} 
                      onValueChange={(value) => setFormData({...formData, category_id: value})}
                    >
                      <SelectTrigger className="mt-2">
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
                    <TagSelector
                      selectedTags={selectedTags}
                      onChange={setSelectedTags}
                    />
                  </div>

                  <div>
                    <ImageUpload
                      value={formData.featured_image_url}
                      onChange={(url) => setFormData({...formData, featured_image_url: url})}
                      label="תמונה ראשית"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_published" className="text-brand-text">פורסם לאתר</Label>
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                    />
                  </div>

                  {/* Scheduling */}
                  <div>
                    <Label className="text-brand-text">תזמון פרסום (אופציונלי)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-2 justify-start text-right font-normal"
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP", { locale: undefined }) : "בחר תאריך"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-brand-text">פעולות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => handleSave(false)} 
                    disabled={saving}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="h-4 w-4 ml-2" />
                    {saving ? 'שומר...' : 'שמור כטיוטה'}
                  </Button>
                  
                  {scheduledDate && scheduledDate > new Date() ? (
                    <Button 
                      onClick={() => handleSave(true, true)} 
                      disabled={saving}
                      className="w-full premium-button-primary"
                    >
                      <Clock className="h-4 w-4 ml-2" />
                      {saving ? 'מתזמן...' : 'תזמן פרסום'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSave(true)} 
                      disabled={saving}
                      className="w-full premium-button-primary"
                    >
                      <Eye className="h-4 w-4 ml-2" />
                      {saving ? 'מפרסם...' : 'פרסם עכשיו'}
                    </Button>
                  )}

                  {formData.is_published && formData.slug && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 ml-2" />
                      צפה במאמר
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Post Statistics */}
              {postId && (
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle className="text-brand-text">סטטיסטיקות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brand-text-secondary">מילים:</span>
                        <span className="text-brand-text font-medium">
                          {formData.content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-text-secondary">זמן קריאה מוערך:</span>
                        <span className="text-brand-text font-medium">
                          {Math.ceil(formData.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} דקות
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-text-secondary">סטטוס:</span>
                        <Badge variant={formData.is_published ? "default" : "secondary"}>
                          {formData.is_published ? 'פורסם' : 'טיוטה'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogEditor;