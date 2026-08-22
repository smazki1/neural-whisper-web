import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/blog/ImageUpload';

interface AuthorProfile {
  display_name: string;
  job_title: string;
  bio: string;
  author_bio: string;
  avatar_url: string;
}

export const AuthorProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AuthorProfile>({
    display_name: '',
    job_title: '',
    bio: '',
    author_bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, job_title, bio, author_bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          job_title: data.job_title || '',
          bio: data.bio || '',
          author_bio: data.author_bio || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת הפרופיל",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: profile.display_name,
          job_title: profile.job_title,
          bio: profile.bio,
          author_bio: profile.author_bio,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Save default author ID to site settings
      const { error: settingsError } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'default_author_id',
          setting_value: user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (settingsError) console.error('Error saving default author:', settingsError);

      toast({
        title: "הצלחה!",
        description: "הפרופיל עודכן בהצלחה"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת הפרופיל",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="premium-card">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-accent" />
          <p className="text-brand-text-secondary">טוען פרופיל...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-text">
          <User className="h-5 w-5" />
          פרופיל מחבר המאמרים
        </CardTitle>
        <p className="text-sm text-brand-text-secondary mt-2">
          המידע שיופיע במאמרים שלך באתר. כל השינויים יעודכנו אוטומטית בכל המאמרים.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Display Name */}
        <div>
          <Label htmlFor="display_name" className="text-brand-text">שם מלא *</Label>
          <Input
            id="display_name"
            value={profile.display_name}
            onChange={(e) => setProfile({...profile, display_name: e.target.value})}
            placeholder="לדוגמה: אבי פריד"
            className="mt-2"
          />
          <p className="text-xs text-brand-text-secondary mt-1">
            השם שיופיע ליד המאמרים שלך
          </p>
        </div>

        {/* Job Title */}
        <div>
          <Label htmlFor="job_title" className="text-brand-text">תפקיד/תואר מקצועי</Label>
          <Input
            id="job_title"
            value={profile.job_title}
            onChange={(e) => setProfile({...profile, job_title: e.target.value})}
            placeholder="לדוגמה: יזם טכנולוגי ומומחה AI"
            className="mt-2"
          />
          <p className="text-xs text-brand-text-secondary mt-1">
            יופיע מתחת לשם שלך בכרטיסי המאמרים
          </p>
        </div>

        {/* Avatar */}
        <div>
          <Label className="text-brand-text">תמונת פרופיל</Label>
          <div className="mt-2">
            <ImageUpload
              value={profile.avatar_url}
              onChange={(url) => setProfile({...profile, avatar_url: url})}
              label=""
            />
          </div>
          <p className="text-xs text-brand-text-secondary mt-1">
            תמונה שתופיע ליד המאמרים שלך (מומלץ 200x200 פיקסלים)
          </p>
        </div>

        {/* Short Bio */}
        <div>
          <Label htmlFor="bio" className="text-brand-text">תיאור קצר</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            placeholder="תיאור קצר (1-2 משפטים) שיופיע בכרטיסי המאמרים"
            rows={2}
            className="mt-2"
          />
          <p className="text-xs text-brand-text-secondary mt-1">
            תיאור קצר שיופיע בכרטיסי המאמרים
          </p>
        </div>

        {/* Full Author Bio */}
        <div>
          <Label htmlFor="author_bio" className="text-brand-text">ביוגרפיה מלאה</Label>
          <Textarea
            id="author_bio"
            value={profile.author_bio}
            onChange={(e) => setProfile({...profile, author_bio: e.target.value})}
            placeholder="ביוגרפיה מפורטת שתופיע בתחתית כל מאמר"
            rows={4}
            className="mt-2"
          />
          <p className="text-xs text-brand-text-secondary mt-1">
            תיאור מפורט שיופיע בתחתית כל מאמר (מומלץ 3-5 שורות)
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={saveProfile}
            disabled={saving || !profile.display_name}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                שומר...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                שמור שינויים
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
