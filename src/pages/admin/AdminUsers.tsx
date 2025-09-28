import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminUsersComponent from '../Admin/AdminUsers';

const AdminUsers = () => {
  return (
    <>
      <Helmet>
        <title>ניהול משתמשים - אזור ניהול</title>
        <meta name="description" content="ניהול משתמשים והרשאות" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול משתמשים</h1>
          <p className="text-lg text-muted-foreground mt-1">
            ניהול משתמשים, תפקידים והרשאות
          </p>
        </div>

        <AdminUsersComponent />
      </div>
    </>
  );
};

export default AdminUsers;