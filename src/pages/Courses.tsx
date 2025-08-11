import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Clock, Tag } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  type: "video" | "pdf" | "slides" | "link";
  label: string;
  url: string;
}

interface Lesson {
  id: string;
  title: string;
  content?: string;
  duration?: string;
  position: number;
  resources: Resource[];
}

interface Module {
  id: string;
  title: string;
  description?: string;
  position: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  category: "strategy" | "marketing" | "tech";
  level: "beginner" | "intermediate" | "advanced";
  duration?: string;
  description?: string;
  published: boolean;
  modules: Module[];
}

const levelLabel: Record<Course["level"], string> = {
  beginner: "מתחילים",
  intermediate: "ביניים",
  advanced: "מתקדמים",
};

const categoryLabel: Record<Course["category"], string> = {
  strategy: "אסטרטגיה",
  marketing: "שיווק",
  tech: "טכנולוגיה",
};

const levelColors: Record<Course["level"], string> = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200",
};

const categoryColors: Record<Course["category"], string> = {
  strategy: "bg-blue-100 text-blue-800 border-blue-200",
  marketing: "bg-purple-100 text-purple-800 border-purple-200",
  tech: "bg-orange-100 text-orange-800 border-orange-200",
};

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      // Load published courses with their modules, lessons, and resources
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      if (!coursesData || coursesData.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      // Load modules for these courses
      const { data: modulesData, error: modulesError } = await supabase
        .from("modules")
        .select("*")
        .in("course_id", coursesData.map(c => c.id))
        .order("position", { ascending: true });

      if (modulesError) throw modulesError;

      // Load lessons for these modules
      const moduleIds = modulesData?.map(m => m.id) || [];
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .in("module_id", moduleIds)
        .order("position", { ascending: true });

      if (lessonsError) throw lessonsError;

      // Load resources for these lessons
      const lessonIds = lessonsData?.map(l => l.id) || [];
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("resources")
        .select("*")
        .in("lesson_id", lessonIds);

      if (resourcesError) throw resourcesError;

      // Organize the data structure
      const coursesWithData: Course[] = coursesData.map(course => ({
        id: course.id,
        title: course.title,
        category: course.category as Course["category"],
        level: course.level as Course["level"],
        duration: course.duration,
        description: course.description,
        published: course.published,
        modules: (modulesData || [])
          .filter(module => module.course_id === course.id)
          .map(module => ({
            id: module.id,
            title: module.title,
            description: module.description,
            position: module.position,
            lessons: (lessonsData || [])
              .filter(lesson => lesson.module_id === module.id)
              .map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                content: lesson.content,
                duration: lesson.duration,
                position: lesson.position,
                resources: (resourcesData || [])
                  .filter(resource => resource.lesson_id === lesson.id)
                  .map(resource => ({
                    id: resource.id,
                    type: resource.type as Resource["type"],
                    label: resource.label || "משאב",
                    url: resource.url,
                  })),
              })),
          })),
      }));

      setCourses(coursesWithData);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("שגיאה בטעינת הקורסים");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: filteredCourses.map((c, i) => ({
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

  const resourceIcon = (type: Resource["type"]) => {
    const className = "mr-1";
    switch (type) {
      case "video":
        return <span className={className}>🎬</span>;
      case "pdf":
        return <span className={className}>📄</span>;
      case "slides":
        return <span className={className}>🖥️</span>;
      default:
        return <span className={className}>🔗</span>;
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>קורסים מפורסמים | AI Master</title>
        <meta
          name="description"
          content="גלה את הקורסים המפורסמים שלנו ברכיבי AI, שיווק ואסטרטגיה עסקית. חומרי למידה איכותיים ומעשיים."
        />
        <link rel="canonical" href="https://ai-master.co.il/courses" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <header className="pt-28 pb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              קורסים מפורסמים
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            גלה את הקורסים המפורסמים שלנו עם תוכן מקיף, שיעורים מובנים וחומרי עזר מעשיים
          </p>
        </div>
      </header>

      <main>
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-8">
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="חפש קורסים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="grid grid-cols-4 sm:inline-flex">
                  <TabsTrigger value="all">הכל ({courses.length})</TabsTrigger>
                  <TabsTrigger value="strategy">
                    אסטרטגיה ({courses.filter(c => c.category === "strategy").length})
                  </TabsTrigger>
                  <TabsTrigger value="marketing">
                    שיווק ({courses.filter(c => c.category === "marketing").length})
                  </TabsTrigger>
                  <TabsTrigger value="tech">
                    טכנולוגיה ({courses.filter(c => c.category === "tech").length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Results */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">לא נמצאו קורסים</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "נסה לשנות את מונחי החיפוש" : "עדיין לא פורסמו קורסים במערכת"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl leading-tight">{course.title}</CardTitle>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={levelColors[course.level]}>
                          {levelLabel[course.level]}
                        </Badge>
                        <Badge variant="outline" className={categoryColors[course.category]}>
                          <Tag className="h-3 w-3 mr-1" />
                          {categoryLabel[course.category]}
                        </Badge>
                      </div>
                      
                      {course.duration && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                      )}
                      
                      <CardDescription className="line-clamp-3">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      {course.modules.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {course.modules.map((module, idx) => (
                            <AccordionItem key={module.id} value={`module-${idx}`}>
                              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    {idx + 1}
                                  </span>
                                  {module.title}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {module.description && (
                                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                                )}
                                <ul className="space-y-4">
                                  {module.lessons.map((lesson, li) => (
                                    <li key={lesson.id} className="rounded-md border p-4 bg-muted/30">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-4">
                                          <div className="flex-1">
                                            <p className="font-medium">{lesson.title}</p>
                                            {lesson.duration && (
                                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <Clock className="h-3 w-3" />
                                                {lesson.duration}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        
                                        {lesson.content && (
                                          <p className="text-sm text-muted-foreground">{lesson.content}</p>
                                        )}
                                        
                                        {lesson.resources.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {lesson.resources.map((resource) => (
                                              <a
                                                key={resource.id}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block"
                                                aria-label={`${resource.label} לשיעור ${lesson.title}`}
                                              >
                                                <Button variant="outline" size="sm" className="text-xs">
                                                  {resourceIcon(resource.type)}
                                                  {resource.label}
                                                </Button>
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          עדיין לא נוספו מודולים לקורס זה
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Courses;