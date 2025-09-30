import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Calendar,
  Tag
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  category: 'advanced' | 'basic' | 'business';
  product_type: 'course' | 'workshop' | 'consultation';
  duration: string | null;
  thumbnail_url: string | null;
  video_preview_url: string | null;
  external_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    category: '',
    product_type: 'course',
    duration: '',
    thumbnail_url: '',
    video_preview_url: '',
    external_url: '',
    is_published: false,
    is_featured: false,
    meta_title: '',
    meta_description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data as any) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת המוצרים",
        variant: "destructive"
      });
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
      slug: generateSlug(title)
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "שגיאה",
        description: "יש לבחור קובץ תמונה בלבד",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      toast({
        title: "שגיאה",
        description: "גודל הקובץ חייב להיות קטן מ-5MB",
        variant: "destructive"
      });
      return;
    }

    setUploadingImage(true);
    
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Update form with the new URL
      setFormData({
        ...formData,
        thumbnail_url: publicUrl
      });
      
      setImagePreview(publicUrl);

      toast({
        title: "הצלחה!",
        description: "התמונה הועלתה בהצלחה"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בהעלאת התמונה",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      short_description: '',
      price: '',
      category: '',
      product_type: 'course',
      duration: '',
      thumbnail_url: '',
      video_preview_url: '',
      external_url: '',
      is_published: false,
      is_featured: false,
      meta_title: '',
      meta_description: '',
    });
    setCurrentProduct(null);
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    try {
      const productData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        short_description: formData.short_description || null,
        price: parseFloat(formData.price),
        category: formData.category as 'advanced' | 'basic' | 'business',
        product_type: formData.product_type as 'course' | 'workshop' | 'consultation',
        duration: formData.duration || null,
        thumbnail_url: formData.thumbnail_url || null,
        video_preview_url: formData.video_preview_url || null,
        external_url: formData.external_url || null,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      if (currentProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id);

        if (error) throw error;

        toast({
          title: "הצלחה!",
          description: "המוצר עודכן בהצלחה"
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "הצלחה!",
          description: "מוצר חדש נוצר בהצלחה"
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת המוצר",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price.toString(),
      category: product.category,
      product_type: product.product_type,
      duration: product.duration || '',
      thumbnail_url: product.thumbnail_url || '',
      video_preview_url: product.video_preview_url || '',
      external_url: product.external_url || '',
      is_published: product.is_published,
      is_featured: product.is_featured,
      meta_title: '',
      meta_description: '',
    });
    setImagePreview(product.thumbnail_url || null);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המוצר?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "המוצר נמחק בהצלחה"
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת המוצר",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: `המוצר ${!currentStatus ? 'פורסם' : 'הוסר מהפרסום'} בהצלחה`
      });

      fetchProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון סטטוס המוצר",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'basic': 'בסיסי',
      'advanced': 'מתקדם',
      'business': 'עסקי'
    };
    return labels[category] || category;
  };

  return (
    <>
      <Helmet>
        <title>ניהול מוצרים - אזור ניהול</title>
        <meta name="description" content="ניהול מוצרים, שירותים וקטגוריות" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">ניהול מוצרים</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                הוסף מוצר חדש
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">כותרת *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="שם המוצר"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="url-friendly-name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="short_description">תיאור קצר</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                    placeholder="תיאור קצר למוצר"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="description">תיאור מלא</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="תיאור מפורט של המוצר"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">מחיר *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">קטגוריה *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">בסיסי</SelectItem>
                        <SelectItem value="advanced">מתקדם</SelectItem>
                        <SelectItem value="business">עסקי</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">משך זמן</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="למשל: 4 שעות"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>תמונה ראשית</Label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Label htmlFor="image_file" className="cursor-pointer">
                            <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors text-center">
                              {uploadingImage ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  <span className="text-sm">מעלה תמונה...</span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Package className="h-8 w-8 mx-auto text-muted-foreground" />
                                  <p className="text-sm font-medium">העלה תמונה מהמחשב</p>
                                  <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (עד 5MB)</p>
                                </div>
                              )}
                            </div>
                          </Label>
                          <input
                            id="image_file"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </div>
                        
                        {imagePreview && (
                          <div className="flex-1">
                            <img 
                              src={imagePreview} 
                              alt="תצוגה מקדימה" 
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">או</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="thumbnail_url" className="text-sm">קישור לתמונה (URL)</Label>
                        <Input
                          id="thumbnail_url"
                          value={formData.thumbnail_url}
                          onChange={(e) => {
                            setFormData({...formData, thumbnail_url: e.target.value});
                            setImagePreview(e.target.value);
                          }}
                          placeholder="https://..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="video_preview_url">וידאו תצוגה מקדימה (URL)</Label>
                    <Input
                      id="video_preview_url"
                      value={formData.video_preview_url}
                      onChange={(e) => setFormData({...formData, video_preview_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="external_url">קישור לעמוד נחיתה חיצוני</Label>
                  <Input
                    id="external_url"
                    value={formData.external_url}
                    onChange={(e) => setFormData({...formData, external_url: e.target.value})}
                    placeholder="https://landing-page.com"
                  />
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                  <h4 className="font-semibold text-sm">הגדרות SEO</h4>
                  <div>
                    <Label htmlFor="meta_title">כותרת META</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                      placeholder="כותרת לחיפוש בגוגל"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta_description">תיאור META</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      placeholder="תיאור למנועי חיפוש (עד 160 תווים)"
                      rows={2}
                      maxLength={160}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="is_published">פרסם מוצר</Label>
                    <p className="text-sm text-muted-foreground">המוצר יהיה זמין לצפייה באתר</p>
                  </div>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="is_featured">מוצר מומלץ</Label>
                    <p className="text-sm text-muted-foreground">יופיע בראש העמוד</p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    ביטול
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'עדכן מוצר' : 'צור מוצר'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">אין מוצרים עדיין</p>
              <p className="text-sm text-muted-foreground mt-2">
                התחל על ידי הוספת המוצר הראשון שלך
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant={product.is_published ? "default" : "secondary"}>
                          {product.is_published ? 'מפורסם' : 'טיוטה'}
                        </Badge>
                        {product.is_featured && (
                          <Badge variant="outline">מומלץ</Badge>
                        )}
                        <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.short_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.short_description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{formatCurrency(product.price)}</span>
                    </div>
                    {product.duration && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{product.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{product.slug}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublished(product.id, product.is_published)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
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
    </>
  );
};

export default AdminProducts;