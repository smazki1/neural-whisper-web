import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube,
  Twitter,
  Search,
  Users,
  Shield,
  Database,
  Code,
  Palette,
  Bell,
  Link,
  Image,
  FileText,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

interface SiteSettings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  social_twitter: string;
  logo_url: string;
  favicon_url: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
  email_notifications: boolean;
  auto_publish_posts: boolean;
  cache_duration: number;
  max_upload_size: number;
}

interface User {
  id: string;
  email: string;
  display_name?: string;
  created_at: string;
  roles: Array<{
    role: 'admin' | 'moderator' | 'user';
  }>;
}

interface BackupInfo {
  id: string;
  created_at: string;
  size: number;
  type: 'manual' | 'automatic';
  status: 'completed' | 'in_progress' | 'failed';
}

export const SettingsPanel = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: 'AI Master',
    site_description: 'מומחה בינה מלאכותית לעסקים',
    site_keywords: 'בינה מלאכותית, AI, קורסים, ייעוץ',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    social_youtube: '',
    social_twitter: '',
    logo_url: '',
    favicon_url: '',
    google_analytics_id: '',
    facebook_pixel_id: '',
    maintenance_mode: false,
    allow_registration: true,
    email_notifications: true,
    auto_publish_posts: false,
    cache_duration: 3600,
    max_upload_size: 10
  });

  const [users, setUsers] = useState<User[]>([]);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  const analytics = useAnalytics();

  useEffect(() => {
    loadSettings();
    loadUsers();
    loadBackups();
  }, []);

  const loadSettings = async () => {
    try {
      // In a real implementation, you would load from a settings table
      // For now, using localStorage as fallback
      const savedSettings = localStorage.getItem('admin_settings');
      if (savedSettings) {
        setSettings({...settings, ...JSON.parse(savedSettings)});
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(10);

      if (error) throw error;
      
      // Transform the data to match our interface
      const usersData = data?.map(user => ({
        id: user.id,
        email: 'לא זמין', // Email not available in profiles table
        display_name: user.display_name,
        created_at: user.created_at,
        roles: [] as Array<{role: 'admin' | 'moderator' | 'user'}>
      })) || [];

      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadBackups = async () => {
    // Mock backup data - in a real implementation, you would load from a backups table
    setBackups([
      {
        id: '1',
        created_at: new Date().toISOString(),
        size: 15728640, // 15MB
        type: 'automatic',
        status: 'completed'
      },
      {
        id: '2',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        size: 14680064, // 14MB
        type: 'manual',
        status: 'completed'
      }
    ]);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real implementation, you would save to a settings table
      localStorage.setItem('admin_settings', JSON.stringify(settings));

      analytics.trackEvent({
        action: 'admin_settings_updated',
        category: 'admin',
        label: activeTab
      });

      toast({
        title: "הצלחה",
        description: "ההגדרות נשמרו בהצלחה",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת ההגדרות",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const createBackup = async () => {
    try {
      toast({
        title: "יוצר גיבוי",
        description: "הגיבוי נוצר ברקע, זה עלול לקחת מספר דקות",
      });

      // In a real implementation, you would call a backup edge function
      // For now, simulating the process
      setTimeout(() => {
        const newBackup: BackupInfo = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          size: Math.floor(Math.random() * 20000000) + 10000000,
          type: 'manual',
          status: 'completed'
        };
        setBackups([newBackup, ...backups]);
        
        toast({
          title: "הצלחה",
          description: "הגיבוי נוצר בהצלחה",
        });
      }, 3000);

      analytics.trackEvent({
        action: 'backup_created',
        category: 'admin'
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה ביצירת הגיבוי",
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    try {
      // First, remove existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then add the new role
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role }]);

      if (error) throw error;

      await loadUsers();
      
      toast({
        title: "הצלחה",
        description: "תפקיד המשתמש עודכן בהצלחה",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון תפקיד המשתמש",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="p-6">טוען הגדרות...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">הגדרות מערכת</h2>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'שומר...' : 'שמור הגדרות'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            כללי
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            יצירת קשר
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            רשתות חברתיות
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            משתמשים
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            מערכת
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות כלליות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_title">כותרת האתר</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => setSettings({...settings, site_title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="site_description">תיאור האתר</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_url">לוגו האתר</Label>
                  <Input
                    id="logo_url"
                    value={settings.logo_url}
                    onChange={(e) => setSettings({...settings, logo_url: e.target.value})}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="favicon_url">Favicon</Label>
                  <Input
                    id="favicon_url"
                    value={settings.favicon_url}
                    onChange={(e) => setSettings({...settings, favicon_url: e.target.value})}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">הגדרות פונקציונליות</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance_mode">מצב תחזוקה</Label>
                    <p className="text-sm text-muted-foreground">האתר לא יהיה זמין למבקרים</p>
                  </div>
                  <Switch
                    id="maintenance_mode"
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenance_mode: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow_registration">אפשר הרשמה</Label>
                    <p className="text-sm text-muted-foreground">אפשר למשתמשים חדשים להירשם</p>
                  </div>
                  <Switch
                    id="allow_registration"
                    checked={settings.allow_registration}
                    onCheckedChange={(checked) => setSettings({...settings, allow_registration: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_notifications">התראות במייל</Label>
                    <p className="text-sm text-muted-foreground">שלח התראות על אירועים חשובים</p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => setSettings({...settings, email_notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_publish_posts">פרסום אוטומטי</Label>
                    <p className="text-sm text-muted-foreground">פרסם פוסטים אוטומטית כשהם מוכנים</p>
                  </div>
                  <Switch
                    id="auto_publish_posts"
                    checked={settings.auto_publish_posts}
                    onCheckedChange={(checked) => setSettings({...settings, auto_publish_posts: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>פרטי יצירת קשר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact_email">אימייל</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                  placeholder="info@ai-master.co.il"
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">טלפון</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                  placeholder="050-123-4567"
                />
              </div>

              <div>
                <Label htmlFor="contact_address">כתובת</Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address}
                  onChange={(e) => setSettings({...settings, contact_address: e.target.value})}
                  placeholder="רחוב הרצל 1, תל אביב"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>רשתות חברתיות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="social_facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook}
                    onChange={(e) => setSettings({...settings, social_facebook: e.target.value})}
                    placeholder="https://facebook.com/aimaster"
                  />
                </div>

                <div>
                  <Label htmlFor="social_instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram}
                    onChange={(e) => setSettings({...settings, social_instagram: e.target.value})}
                    placeholder="https://instagram.com/aimaster"
                  />
                </div>

                <div>
                  <Label htmlFor="social_linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin}
                    onChange={(e) => setSettings({...settings, social_linkedin: e.target.value})}
                    placeholder="https://linkedin.com/company/aimaster"
                  />
                </div>

                <div>
                  <Label htmlFor="social_youtube" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <Input
                    id="social_youtube"
                    value={settings.social_youtube}
                    onChange={(e) => setSettings({...settings, social_youtube: e.target.value})}
                    placeholder="https://youtube.com/@aimaster"
                  />
                </div>

                <div>
                  <Label htmlFor="social_twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter/X
                  </Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter}
                    onChange={(e) => setSettings({...settings, social_twitter: e.target.value})}
                    placeholder="https://twitter.com/aimaster"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_keywords">מילות מפתח</Label>
                <Input
                  id="site_keywords"
                  value={settings.site_keywords}
                  onChange={(e) => setSettings({...settings, site_keywords: e.target.value})}
                  placeholder="בינה מלאכותית, AI, קורסים, ייעוץ"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  הפרד מילות מפתח בפסיקים
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">כלי מדידה</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                    <Input
                      id="google_analytics_id"
                      value={settings.google_analytics_id}
                      onChange={(e) => setSettings({...settings, google_analytics_id: e.target.value})}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                    <Input
                      id="facebook_pixel_id"
                      value={settings.facebook_pixel_id}
                      onChange={(e) => setSettings({...settings, facebook_pixel_id: e.target.value})}
                      placeholder="123456789012345"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">כלים מועילים</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Search Console
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://analytics.google.com', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://pagespeed.web.dev', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    PageSpeed
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('/sitemap.xml', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Sitemap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ניהול משתמשים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{user.display_name || user.email}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        הצטרף: {new Date(user.created_at).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {user.roles.map((role, index) => (
                        <Badge key={index} variant="outline">
                          {role.role === 'admin' ? 'מנהל' : 
                           role.role === 'moderator' ? 'מנהל תוכן' : 'משתמש'}
                        </Badge>
                      ))}
                      <Select 
                        defaultValue={user.roles[0]?.role || 'user'}
                        onValueChange={(value) => updateUserRole(user.id, value as any)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">משתמש</SelectItem>
                          <SelectItem value="moderator">מנהל תוכן</SelectItem>
                          <SelectItem value="admin">מנהל</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    אין משתמשים להצגה
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות מערכת</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cache_duration">משך זמן Cache (שניות)</Label>
                  <Input
                    id="cache_duration"
                    type="number"
                    value={settings.cache_duration}
                    onChange={(e) => setSettings({...settings, cache_duration: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="max_upload_size">גודל העלאה מקסימלי (MB)</Label>
                  <Input
                    id="max_upload_size"
                    type="number"
                    value={settings.max_upload_size}
                    onChange={(e) => setSettings({...settings, max_upload_size: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">גיבויים</h4>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      גיבוי אוטומטי מתבצע מדי יום ב-3:00 בלילה
                    </p>
                  </div>
                  <Button onClick={createBackup}>
                    <Download className="h-4 w-4 mr-2" />
                    צור גיבוי ידני
                  </Button>
                </div>

                <div className="space-y-2">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            גיבוי {backup.type === 'manual' ? 'ידני' : 'אוטומטי'}
                          </span>
                          <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                            {backup.status === 'completed' ? 'הושלם' : 
                             backup.status === 'in_progress' ? 'בתהליך' : 'נכשל'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(backup.created_at).toLocaleString('he-IL')} • {formatFileSize(backup.size)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          הורד
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          שחזר
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4 text-destructive">פעולות מסוכנות</h4>
                <div className="space-y-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        איפוס מערכת
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                        <AlertDialogDescription>
                          פעולה זו תמחק את כל הנתונים במערכת ותחזיר אותה להגדרות ברירת המחדל.
                          פעולה זו לא ניתנת לביטול!
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                          איפוס מערכת
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};