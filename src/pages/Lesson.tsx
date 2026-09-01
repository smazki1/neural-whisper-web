import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ArrowLeft, CheckCircle, BookOpen, Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  duration: string;
  position: number;
}

interface Resource {
  id: string;
  type: 'video' | 'pdf' | 'slides' | 'link' | 'file';
  label: string;
  url: string;
}

interface UserProgress {
  lesson_id: string;
  completed_at: string;
}

const resourceTypeLabel: Record<string, string> = {
  video: "וידאו",
  pdf: "PDF",
  slides: "מצגת",
  link: "קישור",
};

const Lesson: React.FC = () => {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    fetchLessonData();
  }, [courseId, lessonId, user]);

  const fetchLessonData = async () => {
    if (!courseId || !lessonId) return;
    
    try {
      // Check if user has access to this course
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId);

        if (progressError) throw progressError;
        
        setHasAccess(progressData && progressData.length > 0);
        setUserProgress(progressData || []);
      }

      // Fetch course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .eq('published', true)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lesson data with module info
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          *,
          modules!inner(id, title, course_id)
        `)
        .eq('id', lessonId)
        .eq('modules.course_id', courseId)
        .single();

      if (lessonError) throw lessonError;
      setLesson(lessonData);
      setCurrentModule(lessonData.modules);

      // Fetch all lessons in this course for navigation
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId);

      if (modulesError) throw modulesError;

      const moduleIds = modulesData?.map(m => m.id) || [];
      if (moduleIds.length > 0) {
        const { data: allLessonsData, error: allLessonsError } = await supabase
          .from('lessons')
          .select('*')
          .in('module_id', moduleIds)
          .order('position');

        if (allLessonsError) throw allLessonsError;
        setAllLessons(allLessonsData || []);
      }

      // Fetch lesson resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('lesson_id', lessonId);

      if (resourcesError) throw resourcesError;
      setResources(resourcesData || []);

    } catch (error: any) {
      console.error('Error fetching lesson data:', error);
      toast({
        title: "שגיאה בטעינת השיעור",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lesson_id === lessonId && p.completed_at);
  };

  const markLessonComplete = async () => {
    if (!user || !courseId || !lessonId) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
          progress_percentage: 100
        });

      if (error) throw error;

      setUserProgress(prev => [
        ...prev.filter(p => p.lesson_id !== lessonId),
        { lesson_id: lessonId, completed_at: new Date().toISOString() }
      ]);

      toast({
        title: "השיעור הושלם!",
        description: "התקדמותך נשמרה בהצלחה"
      });

    } catch (error: any) {
      toast({
        title: "שגיאה בשמירת התקדמות",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.id === lessonId);
  };

  const getPrevLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const navigateToLesson = (targetLessonId: string) => {
    navigate(`/courses/${courseId}/lesson/${targetLessonId}`);
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-3/4" />
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-4">
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

  if (!hasAccess) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">גישה מוגבלת</h1>
          <p className="text-muted-foreground mb-6">
            כדי לצפות בשיעור זה יש לרכוש את הקורס תחילה
          </p>
          <Button onClick={() => navigate(`/courses/${courseId}`)}>
            חזרה לעמוד הקורס
          </Button>
        </div>
      </div>
    );
  }

  if (!course || !lesson || !currentModule) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">שיעור לא נמצא</h1>
          <p className="text-muted-foreground mb-6">השיעור שחיפשתם אינו קיים</p>
          <Button onClick={() => navigate(`/courses/${courseId}`)}>
            חזרה לעמוד הקורס
          </Button>
        </div>
      </div>
    );
  }

  const prevLesson = getPrevLesson();
  const nextLesson = getNextLesson();
  const completed = isLessonCompleted(lessonId!);

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Helmet>
        <title>{lesson.title} | {course.title} | AI Master</title>
        <meta name="description" content={`שיעור ${lesson.title} מהקורס ${course.title}`} />
        <link rel="canonical" href={`https://ai-master.co.il/courses/${courseId}/lesson/${lessonId}`} />
      </Helmet>

      <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link to="/learn" className="hover:text-foreground">קורסים</Link></li>
            <li><ArrowRight className="h-4 w-4 mx-2" /></li>
            <li><Link to={`/courses/${courseId}`} className="hover:text-foreground">{course.title}</Link></li>
            <li><ArrowRight className="h-4 w-4 mx-2" /></li>
            <li className="text-foreground">{lesson.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{currentModule.title}</p>
                  <h1 className="text-3xl md:text-4xl font-bold">{lesson.title}</h1>
                </div>
                
                {completed ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-medium">הושלם</span>
                  </div>
                ) : (
                  <Button onClick={markLessonComplete} variant="outline">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    סמן כהושלם
                  </Button>
                )}
              </div>
              
              {lesson.duration && (
                <p className="text-muted-foreground">זמן משוער: {lesson.duration}</p>
              )}
            </div>

            {/* Lesson Content */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                {lesson.content ? (
                  <div 
                    className="prose prose-lg max-w-none rtl:prose-headings:text-right rtl:prose-p:text-right"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="mx-auto h-12 w-12 mb-4" />
                    <p>תוכן השיעור עדיין לא זמין</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div>
                {prevLesson && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigateToLesson(prevLesson.id)}
                    className="flex items-center gap-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                    שיעור קודם: {prevLesson.title}
                  </Button>
                )}
              </div>
              
              <div>
                {nextLesson && (
                  <Button 
                    onClick={() => navigateToLesson(nextLesson.id)}
                    className="flex items-center gap-2"
                  >
                    שיעור הבא: {nextLesson.title}
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            {resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>חומרי עזר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        {resource.type === 'video' && <BookOpen className="h-5 w-5 text-blue-500" />}
                        {resource.type === 'pdf' && <Download className="h-5 w-5 text-red-500" />}
                        {resource.type === 'slides' && <Download className="h-5 w-5 text-orange-500" />}
                        {resource.type === 'link' && <ExternalLink className="h-5 w-5 text-green-500" />}
                        
                        <div className="flex-1">
                          <p className="font-medium">{resource.label || 'ללא כותרת'}</p>
                          <p className="text-xs text-muted-foreground">
                            {resourceTypeLabel[resource.type]}
                          </p>
                        </div>
                        
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>ניווט בקורס</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full mb-4"
                  onClick={() => navigate(`/courses/${courseId}`)}
                >
                  <ArrowRight className="h-4 w-4 ml-2" />
                  חזרה לעמוד הקורס
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  שיעור {getCurrentLessonIndex() + 1} מתוך {allLessons.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;