import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminOrdersComponent from '../Admin/AdminOrders';

const AdminOrders = () => {
  return (
    <>
      <Helmet>
        <title>ניהול הזמנות - אזור ניהול</title>
        <meta name="description" content="ניהול הזמנות ותשלומים" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול הזמנות</h1>
          <p className="text-lg text-muted-foreground mt-1">
            מעקב אחר הזמנות, תשלומים וסטטוסים
          </p>
        </div>

        <AdminOrdersComponent />
      </div>
    </>
  );
};

export default AdminOrders;