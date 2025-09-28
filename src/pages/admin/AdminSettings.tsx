import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SettingsPanel } from '@/components/Admin/SettingsPanel';

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
            הגדרות כלליות, SEO וקישורים חברתיים
          </p>
        </div>

        <SettingsPanel />
      </div>
    </>
  );
};

export default AdminSettings;