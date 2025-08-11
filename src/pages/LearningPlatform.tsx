import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Clock, Tag } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  description: string;
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

const LearningPlatform: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, category, level, duration, description')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching courses:', error);
        } else {
          setCourses(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleStartLearning = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({
      "@type": "Course",
      position: i + 1,
      name: c.title,
      description: c.description,
      provider: {
        "@type": "Organization",
        name: "AI Master",
        sameAs: "https://ai-master.co.il",
      },
    })),
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>פלטפורמת למידה: קורסים וחומרי עזר | AI Master</title>
        <meta
          name="description"
          content="פלטפורמת למידה אינטראקטיבית: קורסים מלאים וחומרי עזר לכל שיעור. למדו אסטרטגיה, שיווק וטכנולוגיה עם AI."
        />
        <link rel="canonical" href="https://ai-master.co.il/learn" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <header className="pt-28 pb-8">
        <div className="container mx-auto px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            פלטפורמת למידה אינטראקטיבית
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            מרחב מודרני להצגת קורסים מלאים, מערכי שיעור וחומרי עזר קלים להורדה.
          </p>
        </div>
      </header>

      <main>
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-8">
            {loading ? (
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="flex flex-col">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">אין קורסים זמינים</h2>
                <p className="text-muted-foreground">
                  בקרוב יהיו פה קורסים מדהימים! בינתיים, עקבו אחרינו לעדכונים.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-4 sm:inline-flex mb-8">
                  <TabsTrigger value="all">הכל</TabsTrigger>
                  <TabsTrigger value="strategy">אסטרטגיה</TabsTrigger>
                  <TabsTrigger value="marketing">שיווק</TabsTrigger>
                  <TabsTrigger value="tech">טכנולוגיה</TabsTrigger>
                </TabsList>

                {(["all", "strategy", "marketing", "tech"] as const).map((tab) => (
                  <TabsContent key={tab} value={tab} className="mt-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {courses
                        .filter((c) => (tab === "all" ? true : c.category === tab))
                        .map((course) => (
                          <Card 
                            key={course.id} 
                            className="group flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20"
                          >
                            <CardHeader className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                  {course.title}
                                </CardTitle>
                                <Badge 
                                  variant="secondary" 
                                  className="shrink-0 bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/20"
                                >
                                  {levelLabel[course.level] || course.level}
                                </Badge>
                              </div>
                              
                              <CardDescription className="text-base leading-relaxed mt-3">
                                {course.description}
                              </CardDescription>
                              
                              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Tag className="h-4 w-4" />
                                  {categoryLabel[course.category] || course.category}
                                </div>
                                {course.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {course.duration}
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <Button 
                                onClick={() => handleStartLearning(course.id)}
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                size="lg"
                              >
                                <BookOpen className="ml-2 h-4 w-4" />
                                התחל ללמוד
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                    
                    {courses.filter((c) => (tab === "all" ? true : c.category === tab)).length === 0 && (
                      <div className="text-center py-12">
                        <Tag className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium mb-2">אין קורסים בקטגוריה זו</h3>
                        <p className="text-muted-foreground">
                          נסו לחפש בקטגוריות אחרות או חזרו מאוחר יותר.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};


export default LearningPlatform;
