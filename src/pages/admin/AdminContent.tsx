import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentManager } from '@/components/Admin/ContentManager';

const AdminContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/blog')) return 'blog';
    if (path.includes('/pages')) return 'pages';
    if (path.includes('/media')) return 'media';
    return 'blog';
  };

  const handleTabChange = (value: string) => {
    navigate(`/admin/content/${value}`);
  };

  return (
    <>
      <Helmet>
        <title>ניהול תוכן - אזור ניהול</title>
        <meta name="description" content="ניהול מאמרים, עמודים ומדיה" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול תוכן</h1>
          <p className="text-lg text-muted-foreground mt-1">
            ניהול מאמרים, עמודים ומדיה
          </p>
        </div>

        <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="blog">מאמרים</TabsTrigger>
            <TabsTrigger value="pages">עמודים</TabsTrigger>
            <TabsTrigger value="media">מדיה</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-6">
            <ContentManager />
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              ניהול עמודים יבוא בקרוב
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              ניהול מדיה יבוא בקרוב
            </div>
          </TabsContent>
        </Tabs>

        <Outlet />
      </div>
    </>
  );
};

export default AdminContent;