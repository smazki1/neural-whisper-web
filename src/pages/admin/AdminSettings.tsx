import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { AuthorProfileSettings } from '@/components/admin/AuthorProfileSettings';
import { Settings, User } from 'lucide-react';

const AdminSettings = () => {
  return (
    <>
      <Helmet>
        <title>הגדרות מערכת - אזור ניהול</title>
        <meta name="description" content="הגדרות מערכת ואתר" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">הגדרות מערכת</h1>
          <p className="text-lg text-muted-foreground mt-1">
            הגדרות כלליות, פרופיל מחבר ו-SEO
          </p>
        </div>

        <Tabs defaultValue="general" dir="rtl" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              הגדרות כלליות
            </TabsTrigger>
            <TabsTrigger value="author" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              פרופיל מחבר
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <SettingsPanel />
          </TabsContent>

          <TabsContent value="author">
            <AuthorProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminSettings;
