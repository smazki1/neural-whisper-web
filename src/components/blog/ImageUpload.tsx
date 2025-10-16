import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload = ({ value, onChange, label = 'תמונה ראשית' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "שגיאה",
          description: "יש להעלות קובץ תמונה בלבד",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "שגיאה",
          description: "גודל הקובץ חייב להיות פחות מ-5MB",
          variant: "destructive"
        });
        return;
      }

      setUploading(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      onChange(publicUrl);

      toast({
        title: "הצלחה!",
        description: "התמונה הועלתה בהצלחה"
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "שגיאה",
        description: error.message || "שגיאה בהעלאת התמונה",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    toast({
      title: "התמונה הוסרה",
      description: "התמונה הוסרה בהצלחה"
    });
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload" className="text-brand-text">{label}</Label>
      
      {value ? (
        <div className="relative">
          <img 
            src={value} 
            alt="תצוגה מקדימה" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 left-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="h-12 w-12 text-accent animate-spin" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
            <div className="text-sm text-muted-foreground">
              {uploading ? (
                <span>מעלה תמונה...</span>
              ) : (
                <>
                  <span className="font-semibold text-accent">לחץ להעלאת תמונה</span>
                  <span className="block mt-1">או גרור תמונה לכאן</span>
                  <span className="block mt-1 text-xs">PNG, JPG, GIF עד 5MB</span>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        או הכנס URL ידנית:
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        disabled={uploading}
      />
    </div>
  );
};