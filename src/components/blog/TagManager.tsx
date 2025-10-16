import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Edit2, Trash2, Tag as TagIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const TagManager = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת התגיות",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || ''
      });
    } else {
      setEditingTag(null);
      setFormData({ name: '', slug: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "שגיאה",
        description: "נא למלא שם תגית",
        variant: "destructive"
      });
      return;
    }

    try {
      const slug = formData.slug || generateSlug(formData.name);
      
      if (editingTag) {
        const { error } = await supabase
          .from('blog_tags')
          .update({
            name: formData.name,
            slug,
            description: formData.description || null
          })
          .eq('id', editingTag.id);

        if (error) throw error;
        toast({
          title: "הצלחה!",
          description: "התגית עודכנה בהצלחה"
        });
      } else {
        const { error } = await supabase
          .from('blog_tags')
          .insert([{
            name: formData.name,
            slug,
            description: formData.description || null
          }]);

        if (error) throw error;
        toast({
          title: "הצלחה!",
          description: "התגית נוצרה בהצלחה"
        });
      }

      setIsDialogOpen(false);
      fetchTags();
    } catch (error: any) {
      console.error('Error saving tag:', error);
      toast({
        title: "שגיאה",
        description: error.message || "שגיאה בשמירת התגית",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תגית זו?')) return;

    try {
      const { error } = await supabase
        .from('blog_tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "התגית נמחקה בהצלחה"
      });
      fetchTags();
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      toast({
        title: "שגיאה",
        description: error.message || "שגיאה במחיקת התגית",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="h-5 w-5" />
              ניהול תגיות
            </CardTitle>
            <Button onClick={() => handleOpenDialog()} className="premium-button-primary">
              <Plus className="h-4 w-4 ml-2" />
              תגית חדשה
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">טוען...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              אין תגיות. צור תגית ראשונה!
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{tag.name}</div>
                    <div className="text-xs text-muted-foreground truncate">/{tag.slug}</div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(tag)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(tag.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'עריכת תגית' : 'תגית חדשה'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tag-name">שם התגית *</Label>
              <Input
                id="tag-name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: editingTag ? formData.slug : generateSlug(name)
                  });
                }}
                placeholder="בינה מלאכותית"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="tag-slug">Slug</Label>
              <Input
                id="tag-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="ai"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="tag-description">תיאור (אופציונלי)</Label>
              <Input
                id="tag-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="מאמרים על בינה מלאכותית"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSave} className="premium-button-primary">
              שמור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};