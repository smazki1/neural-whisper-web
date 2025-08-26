import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Image,
  ExternalLink
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminPortfolioProps {
  onStatsUpdate?: () => void;
}

const AdminPortfolio: React.FC<AdminPortfolioProps> = ({ onStatsUpdate }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    display_order: '0',
    is_published: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data as any) || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת פרויקטי הפורטפוליו",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      project_url: '',
      display_order: '0',
      is_published: false
    });
    setCurrentItem(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast({
        title: "שגיאה",
        description: "יש למלא את שם הפרויקט",
        variant: "destructive"
      });
      return;
    }

    try {
      const itemData = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url || null,
        project_url: formData.project_url || null,
        display_order: parseInt(formData.display_order) || 0,
        is_published: formData.is_published
      };

      if (currentItem) {
        const { error } = await supabase
          .from('portfolio')
          .update(itemData)
          .eq('id', currentItem.id);

        if (error) throw error;

        toast({
          title: "הצלחה!",
          description: "הפרויקט עודכן בהצלחה"
        });
      } else {
        const { error } = await supabase
          .from('portfolio')
          .insert([itemData]);

        if (error) throw error;

        toast({
          title: "הצלחה!",
          description: "פרויקט חדש נוצר בהצלחה"
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchItems();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת הפרויקט",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      project_url: item.project_url || '',
      display_order: item.display_order.toString(),
      is_published: item.is_published
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הפרויקט?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "הפרויקט נמחק בהצלחה"
      });

      fetchItems();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת הפרויקט",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: `הפרויקט ${!currentStatus ? 'פורסם' : 'הוסר מהפרסום'} בהצלחה`
      });

      fetchItems();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error updating portfolio item status:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון סטטוס הפרויקט",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול פורטפוליו</h2>
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
              הוסף פרויקט חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'עריכת פרויקט' : 'הוספת פרויקט חדש'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">שם הפרויקט *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="שם הפרויקט"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">תיאור הפרויקט</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="תיאור קצר של הפרויקט"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">תמונת הפרויקט (URL)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="project_url">קישור לפרויקט</Label>
                  <Input
                    id="project_url"
                    value={formData.project_url}
                    onChange={(e) => setFormData({...formData, project_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">סדר תצוגה</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                  />
                  <Label htmlFor="is_published">פורסם</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'עדכן פרויקט' : 'צור פרויקט'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">אין פרויקטים בפורטפוליו עדיין</h3>
            <p className="text-muted-foreground mb-4">התחל ביצירת הפרויקט הראשון שלך</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <Badge variant={item.is_published ? "default" : "secondary"}>
                        {item.is_published ? 'פורסם' : 'טיוטה'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        סדר תצוגה: {item.display_order}
                      </span>
                      {item.project_url && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          יש קישור
                        </span>
                      )}
                      {item.image_url && (
                        <span className="flex items-center gap-1">
                          <Image className="h-3 w-3" />
                          יש תמונה
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublished(item.id, item.is_published)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
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
  );
};

export default AdminPortfolio;