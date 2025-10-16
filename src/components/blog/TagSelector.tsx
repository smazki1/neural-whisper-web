import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

export const TagSelector = ({ selectedTags, onChange }: TagSelectorProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);
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
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const getSelectedTagsData = () => {
    return tags.filter(tag => selectedTags.includes(tag.id));
  };

  return (
    <div className="space-y-2">
      <Label>תגיות</Label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {getSelectedTagsData().map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="bg-accent/10 text-accent border-accent/20 pl-1"
          >
            {tag.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-right"
          >
            <Plus className="h-4 w-4 ml-2" />
            הוסף תגיות
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command dir="rtl">
            <CommandInput placeholder="חפש תגית..." />
            <CommandEmpty>לא נמצאו תגיות</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    handleToggleTag(tag.id);
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`ml-2 h-4 w-4 rounded-sm border ${
                      selectedTags.includes(tag.id)
                        ? 'bg-accent border-accent'
                        : 'border-input'
                    }`}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};