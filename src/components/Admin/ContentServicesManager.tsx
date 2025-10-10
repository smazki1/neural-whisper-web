import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, Save, X, BookOpen, Download, Wrench, FileText } from 'lucide-react';

interface ContentService {
  id: string;
  name: string;
  content_type: string;
  short_description: string | null;
  detailed_description: string | null;
  main_image_url: string | null;
  status: string;
  duration: string | null;
  action_link: string | null;
  display_order: number;
  search_tags: string | null;
  created_at: string;
  updated_at: string;
}

const contentTypeIcons = {
  'מאמר': BookOpen,
  'מדריך': FileText,
  'כלי': Wrench,
  'הורדה': Download,
};

const contentTypeOptions = [
  { value: 'מאמר', label: 'מאמר' },
  { value: 'מדריך', label: 'מדריך' },
  { value: 'כלי', label: 'כלי' },
  { value: 'הורדה', label: 'הורדה' },
];

const statusOptions = [
  { value: 'טיוטה', label: 'טיוטה' },
  { value: 'פעיל', label: 'פעיל' },
  { value: 'מוסתר', label: 'מוסתר' },
];

export const ContentServicesManager = () => {
  const [contents, setContents] = useState<ContentService[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    content_type: 'מאמר',
    short_description: '',
    detailed_description: '',
    main_image_url: '',
    status: 'טיוטה',
    duration: '',
    action_link: '',
    display_order: 0,
    search_tags: '',
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('content_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error: any) {
      toast.error('שגיאה בטעינת תכנים: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('content_services')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('התוכן עודכן בהצלחה');
      } else {
        const { error } = await supabase
          .from('content_services')
          .insert([formData]);

        if (error) throw error;
        toast.success('התוכן נוסף בהצלחה');
      }

      resetForm();
      fetchContents();
    } catch (error: any) {
      toast.error('שגיאה בשמירת התוכן: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: ContentService) => {
    setFormData({
      name: content.name,
      content_type: content.content_type,
      short_description: content.short_description || '',
      detailed_description: content.detailed_description || '',
      main_image_url: content.main_image_url || '',
      status: content.status,
      duration: content.duration || '',
      action_link: content.action_link || '',
      display_order: content.display_order,
      search_tags: content.search_tags || '',
    });
    setEditingId(content.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תוכן זה?')) return;

    try {
      const { error } = await supabase
        .from('content_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('התוכן נמחק בהצלחה');
      fetchContents();
    } catch (error: any) {
      toast.error('שגיאה במחיקת התוכן: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      content_type: 'מאמר',
      short_description: '',
      detailed_description: '',
      main_image_url: '',
      status: 'טיוטה',
      duration: '',
      action_link: '',
      display_order: 0,
      search_tags: '',
    });
    setEditingId(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{editingId ? 'עריכת תוכן' : 'תוכן חדש'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="w-4 h-4 ml-2" />
              ביטול
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">פרטים בסיסיים</TabsTrigger>
                <TabsTrigger value="advanced">פרטים מתקדמים</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">כותרת *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content_type">סוג תוכן *</Label>
                    <Select
                      value={formData.content_type}
                      onValueChange={(value) => setFormData({ ...formData, content_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">סטטוס *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">תיאור קצר</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailed_description">תיאור מפורט</Label>
                  <Textarea
                    id="detailed_description"
                    value={formData.detailed_description}
                    onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="main_image_url">URL תמונה</Label>
                  <Input
                    id="main_image_url"
                    type="url"
                    value={formData.main_image_url}
                    onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">משך זמן</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="5 דקות קריאה"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order">סדר תצוגה</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action_link">קישור פעולה</Label>
                  <Input
                    id="action_link"
                    type="url"
                    value={formData.action_link}
                    onChange={(e) => setFormData({ ...formData, action_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search_tags">תגיות חיפוש (מופרדות בפסיק)</Label>
                  <Input
                    id="search_tags"
                    value={formData.search_tags}
                    onChange={(e) => setFormData({ ...formData, search_tags: e.target.value })}
                    placeholder="AI, שיווק, כלים"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 ml-2" />
                {loading ? 'שומר...' : 'שמור'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                ביטול
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">תכנים חינמיים</h2>
          <p className="text-muted-foreground">מדריכים, כלים ומשאבים למשתמשים</p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="w-4 h-4 ml-2" />
          תוכן חדש
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>כותרת</TableHead>
              <TableHead>סוג</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>סדר</TableHead>
              <TableHead>עודכן</TableHead>
              <TableHead className="text-left">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  אין תכנים עדיין. צור תוכן ראשון!
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content) => {
                const Icon = contentTypeIcons[content.content_type as keyof typeof contentTypeIcons] || FileText;
                return (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{content.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{content.content_type}</TableCell>
                    <TableCell>
                      <Badge variant={content.status === 'פעיל' ? 'default' : 'secondary'}>
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{content.display_order}</TableCell>
                    <TableCell>
                      {new Date(content.updated_at).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(content)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
