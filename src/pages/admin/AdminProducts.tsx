import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AdminProductsComponent from '../Admin/AdminProducts';

const AdminProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/new')) return 'new';
    if (path.includes('/categories')) return 'categories';
    return 'all';
  };

  const handleTabChange = (value: string) => {
    if (value === 'all') {
      navigate('/admin/products');
    } else {
      navigate(`/admin/products/${value}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>ניהול מוצרים - אזור ניהול</title>
        <meta name="description" content="ניהול מוצרים, שירותים וקטגוריות" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ניהול מוצרים</h1>
            <p className="text-lg text-muted-foreground mt-1">
              ניהול מוצרים, שירותים וקטגוריות
            </p>
          </div>
          <Button onClick={() => navigate('/admin/products/new')} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            מוצר חדש
          </Button>
        </div>

        <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">כל המוצרים</TabsTrigger>
            <TabsTrigger value="new">הוסף מוצר</TabsTrigger>
            <TabsTrigger value="categories">קטגוריות</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <AdminProductsComponent />
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              טופס הוספת מוצר חדש יבוא בקרוב
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              ניהול קטגוריות יבוא בקרוב
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminProducts;