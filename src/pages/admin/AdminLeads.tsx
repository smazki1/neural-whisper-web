import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LeadPipeline } from '@/components/admin/LeadPipeline';

const AdminLeads = () => {
  return (
    <>
      <Helmet>
        <title>ניהול לידים - אזור ניהול</title>
        <meta name="description" content="ניהול לידים ופניות לקוחות" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול לידים</h1>
          <p className="text-lg text-muted-foreground mt-1">
            ניהול פניות לקוחות ומעקב אחר לידים
          </p>
        </div>

        <LeadPipeline />
      </div>
    </>
  );
};

export default AdminLeads;
