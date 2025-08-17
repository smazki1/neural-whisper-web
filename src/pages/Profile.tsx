import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Mail, Calendar } from "lucide-react";

interface Profile {
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      } else {
        // Create empty profile if doesn't exist
        setDisplayName(user.email?.split('@')[0] || '');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "שגיאה בטעינת הפרופיל",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setPageLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const profileData = {
        id: user.id,
        display_name: displayName,
        bio: bio,
        avatar_url: avatarUrl,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      setProfile({
        ...profileData,
        created_at: profile?.created_at || new Date().toISOString()
      });

      toast({
        title: "הפרופיל נשמר!",
        description: "הפרטים שלך עודכנו בהצלחה"
      });

    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "שגיאה בשמירת הפרופיל",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (pageLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-12 w-1/3" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Helmet>
        <title>הפרופיל שלי | AI Master</title>
        <meta name="description" content="נהל את הפרופיל האישי שלך ועדכן את הפרטים" />
        <link rel="canonical" href="https://ai-master.co.il/profile" />
      </Helmet>

      <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">הפרופיל שלי</h1>

          <div className="space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  פרטים אישיים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="text-lg">
                      {displayName ? getInitials(displayName) : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{displayName || 'לא מוגדר'}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    {profile?.created_at && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>חבר מאז {new Date(profile.created_at).toLocaleDateString('he-IL')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  עריכת פרופיל
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">שם להצגה</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="השם שיוצג לאחרים"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">קישור לתמונת פרופיל</Label>
                  <Input
                    id="avatarUrl"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">אודות</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="ספר על עצמך..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={saveProfile} disabled={saving} className="flex-1">
                    {saving ? 'שומר...' : 'שמור שינויים'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    חזרה ללוח הבקרה
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>מידע על החשבון</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>אימייל:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>סטטוס חשבון:</span>
                    <span className="text-green-600">פעיל</span>
                  </div>
                  {profile?.created_at && (
                    <div className="flex justify-between">
                      <span>תאריך הצטרפות:</span>
                      <span>{new Date(profile.created_at).toLocaleDateString('he-IL')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;