import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, PlayCircle, CheckCircle, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  position: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  duration: string;
  position: number;
}

interface UserProgress {
  course_id: string;
  lesson_id: string;
  progress_percentage: number;
  completed_at: string;
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

const Course: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchCourseData();
  }, [id, user]);

  const fetchCourseData = async () => {
    if (!id) return;
    
    try {
      // Fetch course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch modules and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', id)
        .order('position');

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      const moduleIds = modulesData?.map(m => m.id) || [];
      if (moduleIds.length > 0) {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .in('module_id', moduleIds)
          .order('position');

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);
      }

      // Check user access and fetch progress if user is logged in
      if (user) {
        // Check if user has access to this course
        const { data: accessData } = await supabase
          .from("user_course_access")
          .select("id")
          .eq("course_id", id)
          .eq("user_id", user.id)
          .single();

        setHasAccess(!!accessData);

        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id);

        if (progressError) throw progressError;
        setUserProgress(progressData || []);
      } else {
        // If course is published, allow viewing but not access to content
        setHasAccess(false);
      }

    } catch (error: any) {
      console.error('Error fetching course data:', error);
      toast({
        title: "שגיאה בטעינת הקורס",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getLessonsByModule = (moduleId: string) => {
    return lessons.filter(lesson => lesson.module_id === moduleId);
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lesson_id === lessonId && p.completed_at);
  };

  const getCourseProgress = () => {
    if (lessons.length === 0) return 0;
    const completedLessons = lessons.filter(lesson => isLessonCompleted(lesson.id));
    return Math.round((completedLessons.length / lessons.length) * 100);
  };

  const handleStartLesson = (lessonId: string) => {
    if (!hasAccess && !user) {
      navigate("/auth");
      return;
    }
    if (!hasAccess) {
      toast({
        title: "גישה מוגבלת",
        description: "אין לך גישה לקורס זה. יש לרכוש את המוצר המתאים.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/courses/${id}/lesson/${lessonId}`);
  };

  const handlePurchase = () => {
    // Navigate to products page to find this course's product
    navigate('/products');
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">קורס לא נמצא</h1>
          <p className="text-muted-foreground mb-6">הקורס שחיפשתם אינו קיים או לא פורסם</p>
          <Button onClick={() => navigate('/learn')}>
            חזרה לרשימת קורסים
          </Button>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "AI Master",
      sameAs: "https://ai-master.co.il",
    },
    courseMode: "online",
    educationalLevel: levelLabel[course.level] || course.level,
    about: categoryLabel[course.category] || course.category,
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Helmet>
        <title>{course.title} | AI Master</title>
        <meta name="description" content={course.description || `קורס ${course.title} ב-AI Master`} />
        <link rel="canonical" href={`https://ai-master.co.il/courses/${id}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link to="/learn" className="hover:text-foreground">קורסים</Link></li>
            <li><ArrowRight className="h-4 w-4 mx-2" /></li>
            <li className="text-foreground">{course.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">
                  {categoryLabel[course.category] || course.category}
                </Badge>
                <Badge variant="outline">
                  {levelLabel[course.level] || course.level}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              
              {course.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              )}

              {hasAccess && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">התקדמות בקורס</span>
                    <span className="text-sm text-muted-foreground">{getCourseProgress()}%</span>
                  </div>
                  <Progress value={getCourseProgress()} className="h-2" />
                </div>
              )}
            </div>

            {/* Course Content */}
            <div>
              <h2 className="text-2xl font-bold mb-6">תכנית הקורס</h2>
              
              {modules.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">תוכן הקורס בהכנה...</p>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-4">
                  {modules.map((module) => {
                    const moduleLessons = getLessonsByModule(module.id);
                    const completedCount = moduleLessons.filter(lesson => isLessonCompleted(lesson.id)).length;
                    
                    return (
                      <AccordionItem key={module.id} value={module.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full text-right">
                            <div>
                              <h3 className="text-lg font-semibold">{module.title}</h3>
                              {module.description && (
                                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {completedCount}/{moduleLessons.length} שיעורים
                              </span>
                              {hasAccess && completedCount === moduleLessons.length && moduleLessons.length > 0 && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-2">
                            {moduleLessons.map((lesson) => {
                              const isCompleted = isLessonCompleted(lesson.id);
                              
                              return (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                    hasAccess 
                                      ? 'hover:bg-accent cursor-pointer' 
                                      : 'opacity-60'
                                  }`}
                                  onClick={() => handleStartLesson(lesson.id)}
                                >
                                  <div className="flex items-center gap-3">
                                    {hasAccess ? (
                                      isCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <PlayCircle className="h-5 w-5 text-primary" />
                                      )
                                    ) : (
                                      <Lock className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <span className="font-medium">{lesson.title}</span>
                                  </div>
                                  
                                  {lesson.duration && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Clock className="h-4 w-4" />
                                      {lesson.duration}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>מידע על הקורס</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>משך: {course.duration}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>{lessons.length} שיעורים</span>
                </div>

                {hasAccess ? (
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">יש לך גישה לקורס</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        const firstLesson = lessons.find(l => !isLessonCompleted(l.id)) || lessons[0];
                        if (firstLesson) handleStartLesson(firstLesson.id);
                      }}
                      disabled={lessons.length === 0}
                    >
                      {getCourseProgress() > 0 ? 'המשך ללמוד' : 'התחל ללמוד'}
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      כדי לגשת לתוכן הקורס יש לרכוש אותו תחילה
                    </p>
                    <Button className="w-full" onClick={handlePurchase}>
                      רכישת הקורס
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;