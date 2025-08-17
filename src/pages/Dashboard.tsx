import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Trophy, Clock, PlayCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
}

interface UserProgress {
  course_id: string;
  progress_percentage: number;
  completed_at: string;
}

interface Order {
  id: string;
  product_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  products: {
    title: string;
    category: string;
  };
}

const categoryLabel: Record<string, string> = {
  strategy: "אסטרטגיה",
  marketing: "שיווק",
  tech: "טכנולוגיה",
};

const levelLabel: Record<string, string> = {
  beginner: "מתחילים",
  intermediate: "ביניים",
  advanced: "מתקדמים",
};

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user's orders to see what courses they have access to
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          products (title, category)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch user's progress for all courses
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;
      setUserProgress(progressData || []);

      // Get course IDs that user has access to
      const accessibleCourseIds = progressData?.map(p => p.course_id) || [];
      
      if (accessibleCourseIds.length > 0) {
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', accessibleCourseIds)
          .eq('published', true);

        if (coursesError) throw coursesError;
        setCourses(coursesData || []);
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "שגיאה בטעינת הנתונים",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setPageLoading(false);
    }
  };

  const getCourseProgress = (courseId: string) => {
    const progress = userProgress.find(p => p.course_id === courseId);
    return progress?.progress_percentage || 0;
  };

  const isCourseCompleted = (courseId: string) => {
    const progress = userProgress.find(p => p.course_id === courseId);
    return progress?.completed_at !== null;
  };

  const getCompletedCoursesCount = () => {
    return userProgress.filter(p => p.completed_at).length;
  };

  const getAverageProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0);
    return Math.round(totalProgress / userProgress.length);
  };

  const getTotalLearningTime = () => {
    // Simplified calculation - in real app you'd track actual time spent
    return courses.length * 2; // Assuming 2 hours per course as example
  };

  if (pageLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="space-y-6">
            <Skeleton className="h-12 w-1/2" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Helmet>
        <title>לוח בקרה | AI Master</title>
        <meta name="description" content="לוח הבקרה האישי שלך - עקוב אחר הקורסים שלך והתקדמות" />
        <link rel="canonical" href="https://ai-master.co.il/dashboard" />
      </Helmet>

      <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">שלום, {user?.user_metadata?.display_name || 'לומד יקר'}!</h1>
          <p className="text-muted-foreground">ברוך הבא ללוח הבקרה האישי שלך</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">קורסים פעילים</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                קורסים שיש לך גישה אליהם
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">קורסים שהושלמו</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedCoursesCount()}</div>
              <p className="text-xs text-muted-foreground">
                {getAverageProgress()}% התקדמות ממוצעת
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">זמן למידה</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalLearningTime()}h</div>
              <p className="text-xs text-muted-foreground">
                זמן למידה משוער
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Courses */}
          <div>
            <h2 className="text-2xl font-bold mb-6">הקורסים שלי</h2>
            
            {courses.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">אין קורסים פעילים</h3>
                  <p className="text-muted-foreground mb-4">
                    רכוש קורס כדי להתחיל ללמוד
                  </p>
                  <Button onClick={() => navigate('/products')}>
                    עיין במוצרים
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => {
                  const progress = getCourseProgress(course.id);
                  const completed = isCourseCompleted(course.id);
                  
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span>{categoryLabel[course.category] || course.category}</span>
                              <span>{levelLabel[course.level] || course.level}</span>
                              {course.duration && <span>{course.duration}</span>}
                            </div>
                          </div>
                          
                          {completed ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-5 w-5" />
                              <span className="text-sm font-medium">הושלם</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-primary">
                              <PlayCircle className="h-5 w-5" />
                              <span className="text-sm font-medium">פעיל</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">התקדמות</span>
                            <span className="text-sm text-muted-foreground">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={() => navigate(`/courses/${course.id}`)}
                          variant={completed ? "outline" : "default"}
                        >
                          {completed ? 'צפה בקורס' : progress > 0 ? 'המשך ללמוד' : 'התחל ללמוד'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div>
            <h2 className="text-2xl font-bold mb-6">הרכישות שלי</h2>
            
            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">אין רכישות</h3>
                  <p className="text-muted-foreground mb-4">
                    היסטוריית הרכישות שלך תופיע כאן
                  </p>
                  <Button onClick={() => navigate('/products')}>
                    עיין במוצרים
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{order.products.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          ₪{order.total_amount}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{categoryLabel[order.products.category] || order.products.category}</span>
                        <span>
                          {new Date(order.created_at).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {orders.length > 5 && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      צפה בעוד רכישות
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;