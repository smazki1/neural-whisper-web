import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link2, Unlink, BookOpen, Package } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
}

interface Course {
  id: string;
  title: string;
  published: boolean;
}

interface ProductCourse {
  id: string;
  product_id: string;
  course_id: string;
  created_at: string;
  products: Product;
  courses: Course;
}

export default function AdminProductCourses() {
  const [productCourses, setProductCourses] = useState<ProductCourse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch existing product-course links
      const { data: links, error: linksError } = await supabase
        .from("products_courses")
        .select(`
          id,
          product_id,
          course_id,
          created_at,
          products (id, title, slug, is_published),
          courses (id, title, published)
        `)
        .order("created_at", { ascending: false });

      if (linksError) throw linksError;

      // Fetch all products
      const { data: allProducts, error: productsError } = await supabase
        .from("products")
        .select("id, title, slug, is_published")
        .order("title");

      if (productsError) throw productsError;

      // Fetch all courses
      const { data: allCourses, error: coursesError } = await supabase
        .from("courses")
        .select("id, title, published")
        .order("title");

      if (coursesError) throw coursesError;

      setProductCourses(links || []);
      setProducts(allProducts || []);
      setCourses(allCourses || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkProductToCourse = async () => {
    if (!selectedProduct || !selectedCourse) {
      toast.error("יש לבחור מוצר וקורס");
      return;
    }

    try {
      const { error } = await supabase
        .from("products_courses")
        .insert({
          product_id: selectedProduct,
          course_id: selectedCourse
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("הקישור כבר קיים");
          return;
        }
        throw error;
      }

      toast.success("המוצר קושר לקורס בהצלחה");
      setSelectedProduct("");
      setSelectedCourse("");
      fetchData();
    } catch (error) {
      console.error("Error linking product to course:", error);
      toast.error("שגיאה בקישור המוצר לקורס");
    }
  };

  const handleUnlinkProductFromCourse = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from("products_courses")
        .delete()
        .eq("id", linkId);

      if (error) throw error;

      toast.success("הקישור הוסר בהצלחה");
      fetchData();
    } catch (error) {
      console.error("Error unlinking product from course:", error);
      toast.error("שגיאה בהסרת הקישור");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link2 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">קישור מוצרים לקורסים</h2>
      </div>

      {/* Add new link form */}
      <Card>
        <CardHeader>
          <CardTitle>הוספת קישור חדש</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">מוצר</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מוצר" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{product.title}</span>
                        {!product.is_published && (
                          <Badge variant="secondary" className="text-xs">
                            טיוטה
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">קורס</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קורס" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.title}</span>
                        {!course.published && (
                          <Badge variant="secondary" className="text-xs">
                            טיוטה
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleLinkProductToCourse}
                disabled={!selectedProduct || !selectedCourse}
                className="w-full"
              >
                <Link2 className="ml-2 h-4 w-4" />
                קשר מוצר לקורס
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">קישורים קיימים ({productCourses.length})</h3>
        
        {productCourses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              עדיין לא נוצרו קישורים בין מוצרים לקורסים
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {productCourses.map((link) => (
              <Card key={link.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{link.products.title}</span>
                        {!link.products.is_published && (
                          <Badge variant="secondary" className="text-xs">
                            טיוטה
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>←</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{link.courses.title}</span>
                        {!link.courses.published && (
                          <Badge variant="secondary" className="text-xs">
                            טיוטה
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(link.created_at).toLocaleDateString("he-IL")}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnlinkProductFromCourse(link.id)}
                      >
                        <Unlink className="h-4 w-4" />
                        הסר קישור
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
