import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Copy, Trash2, Eye, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentService {
  id: string;
  name: string;
  content_type: string;
  short_description: string;
  detailed_description: string;
  price: number | null;
  duration: string;
  main_image_url: string;
  status: string;
  page_title: string;
  suitable_for: string;
  what_included: string;
  content_structure: string;
  prerequisites: string;
  additional_info: string;
  action_link: string;
  search_tags: string;
  display_order: number;
  created_at: string;
}

interface ContentServiceFormData {
  name: string;
  content_type: string;
  short_description: string;
  detailed_description: string;
  price: string;
  duration: string;
  main_image_url: string;
  status: string;
  page_title: string;
  suitable_for: string;
  what_included: string;
  content_structure: string;
  prerequisites: string;
  additional_info: string;
  action_link: string;
  search_tags: string;
}

const initialFormData: ContentServiceFormData = {
  name: '',
  content_type: '',
  short_description: '',
  detailed_description: '',
  price: '',
  duration: '',
  main_image_url: '',
  status: 'טיוטה',
  page_title: '',
  suitable_for: '',
  what_included: '',
  content_structure: '',
  prerequisites: '',
  additional_info: '',
  action_link: '',
  search_tags: '',
};

const contentTypes = [
  'הרצאה',
  'סדנה', 
  'קורס דיגיטלי',
  'ליווי אישי',
  'מאמר',
  'מדריך'
];

const statusOptions = [
  'פעיל',
  'טיוטה',
  'לא פעיל'
];

const AdminContentServices = () => {
  const [contentServices, setContentServices] = useState<ContentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ContentServiceFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContentServices();
  }, []);

  const fetchContentServices = async () => {
    try {
      const { data, error } = await supabase
        .from('content_services')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentServices(data || []);
    } catch (error) {
      console.error('Error fetching content services:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת רשימת התכנים והשירותים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ContentServiceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content_type) {
      toast({
        title: "שגיאה",
        description: "נא למלא לפחות שם הפעילות וסוג התוכן",
        variant: "destructive"
      });
      return;
    }

    try {
      const dataToSubmit = {
        name: formData.name,
        content_type: formData.content_type,
        short_description: formData.short_description || null,
        detailed_description: formData.detailed_description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        duration: formData.duration || null,
        main_image_url: formData.main_image_url || null,
        status: formData.status,
        page_title: formData.page_title || null,
        suitable_for: formData.suitable_for || null,
        what_included: formData.what_included || null,
        content_structure: formData.content_structure || null,
        prerequisites: formData.prerequisites || null,
        additional_info: formData.additional_info || null,
        action_link: formData.action_link || null,
        search_tags: formData.search_tags || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('content_services')
          .update(dataToSubmit)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({
          title: "הצלחה",
          description: "הפריט עודכן בהצלחה"
        });
      } else {
        const { error } = await supabase
          .from('content_services')
          .insert([dataToSubmit]);
        
        if (error) throw error;
        toast({
          title: "הצלחה", 
          description: "פריט חדש נוסף בהצלחה"
        });
      }

      setFormData(initialFormData);
      setEditingId(null);
      setIsDialogOpen(false);
      fetchContentServices();
    } catch (error) {
      console.error('Error saving content service:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת הפריט",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: ContentService) => {
    setFormData({
      name: item.name,
      content_type: item.content_type,
      short_description: item.short_description || '',
      detailed_description: item.detailed_description || '',
      price: item.price?.toString() || '',
      duration: item.duration || '',
      main_image_url: item.main_image_url || '',
      status: item.status,
      page_title: item.page_title || '',
      suitable_for: item.suitable_for || '',
      what_included: item.what_included || '',
      content_structure: item.content_structure || '',
      prerequisites: item.prerequisites || '',
      additional_info: item.additional_info || '',
      action_link: item.action_link || '',
      search_tags: item.search_tags || '',
    });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleDuplicate = async (item: ContentService) => {
    try {
      const duplicateData = {
        name: `${item.name} - עותק`,
        content_type: item.content_type,
        short_description: item.short_description,
        detailed_description: item.detailed_description,
        price: item.price,
        duration: item.duration,
        main_image_url: item.main_image_url,
        status: 'טיוטה',
        page_title: item.page_title,
        suitable_for: item.suitable_for,
        what_included: item.what_included,
        content_structure: item.content_structure,
        prerequisites: item.prerequisites,
        additional_info: item.additional_info,
        action_link: item.action_link,
        search_tags: item.search_tags,
      };

      const { error } = await supabase
        .from('content_services')
        .insert([duplicateData]);
      
      if (error) throw error;
      
      toast({
        title: "הצלחה",
        description: "הפריט שוכפל בהצלחה"
      });
      
      fetchContentServices();
    } catch (error) {
      console.error('Error duplicating item:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשכפול הפריט",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) return;

    try {
      const { error } = await supabase
        .from('content_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "הצלחה",
        description: "הפריט נמחק בהצלחה"
      });
      
      fetchContentServices();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "שגיאה", 
        description: "שגיאה במחיקת הפריט",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'פעיל': return 'default';
      case 'טיוטה': return 'secondary';
      case 'לא פעיל': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ניהול תכנים ושירותים</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setFormData(initialFormData);
                setEditingId(null);
              }}
            >
              <Plus className="h-4 w-4 ml-2" />
              הוסף פריט חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'עריכת פריט' : 'הוספת פריט חדש'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">שם הפעילות/תוכן *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="content_type">סוג התוכן *</Label>
                  <Select value={formData.content_type} onValueChange={(value) => handleInputChange('content_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר סוג תוכן" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">תיאור קצר (עד 100 תווים)</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  maxLength={100}
                />
                <span className="text-sm text-muted-foreground">
                  {formData.short_description.length}/100
                </span>
              </div>

              <div>
                <Label htmlFor="detailed_description">תיאור מפורט</Label>
                <Textarea
                  id="detailed_description"
                  value={formData.detailed_description}
                  onChange={(e) => handleInputChange('detailed_description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">מחיר (₪)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">משך זמן</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="למשל: 3 שעות, 4 מפגשים"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">סטטוס</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="main_image_url">תמונה ראשית (URL)</Label>
                <Input
                  id="main_image_url"
                  type="url"
                  value={formData.main_image_url}
                  onChange={(e) => handleInputChange('main_image_url', e.target.value)}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">תוכן דף הפריט</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="page_title">כותרת לדף</Label>
                    <Input
                      id="page_title"
                      value={formData.page_title}
                      onChange={(e) => handleInputChange('page_title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="suitable_for">למי זה מתאים</Label>
                    <Textarea
                      id="suitable_for"
                      value={formData.suitable_for}
                      onChange={(e) => handleInputChange('suitable_for', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="what_included">מה כלול</Label>
                    <Textarea
                      id="what_included"
                      value={formData.what_included}
                      onChange={(e) => handleInputChange('what_included', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content_structure">מבנה התוכן</Label>
                    <Textarea
                      id="content_structure"
                      value={formData.content_structure}
                      onChange={(e) => handleInputChange('content_structure', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prerequisites">דרישות קדם</Label>
                    <Input
                      id="prerequisites"
                      value={formData.prerequisites}
                      onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional_info">מידע נוסף</Label>
                    <Textarea
                      id="additional_info"
                      value={formData.additional_info}
                      onChange={(e) => handleInputChange('additional_info', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="action_link">לינק לפעולה</Label>
                    <Input
                      id="action_link"
                      type="url"
                      value={formData.action_link}
                      onChange={(e) => handleInputChange('action_link', e.target.value)}
                      placeholder="קישור להרשמה/רכישה/יצירת קשר"
                    />
                  </div>

                  <div>
                    <Label htmlFor="search_tags">תגיות לחיפוש</Label>
                    <Input
                      id="search_tags"
                      value={formData.search_tags}
                      onChange={(e) => handleInputChange('search_tags', e.target.value)}
                      placeholder="מופרד בפסיקים"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit">
                  {editingId ? 'עדכן' : 'הוסף'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת פריטים קיימים</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentServices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.content_type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(item)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {contentServices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      אין פריטים להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContentServices;