import React from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Simple demo data. You can later connect this to Supabase for dynamic content.
interface Resource {
  type: "video" | "pdf" | "slides" | "link";
  label: string;
  url: string;
}

interface Lesson {
  title: string;
  duration?: string;
  resources: Resource[];
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  category: "strategy" | "marketing" | "tech";
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  description: string;
  modules: Module[];
}

const courses: Course[] = [
  {
    id: "ai-business-mastery",
    title: "AI Business Mastery",
    category: "strategy",
    level: "advanced",
    duration: "9 שעות · 3 מפגשים",
    description:
      "תוכנית אסטרטגית מקיפה לבעלי עסקים שרוצים להפוך את ה-AI למנוע צמיחה תחרותי ולבנות יתרון ארוך טווח.",
    modules: [
      {
        title: "אסטרטגיית שוק ומיצוב תחרותי",
        lessons: [
          {
            title: "מיפוי הזדמנויות ונישות עם AI",
            duration: "50 ד׳",
            resources: [
              { type: "video", label: "וידאו מלא", url: "#" },
              { type: "pdf", label: "דוח הזדמנויות", url: "#" },
              { type: "slides", label: "מצגת השיעור", url: "#" },
            ],
          },
          {
            title: "חקר קהל והתנהגות",
            duration: "35 ד׳",
            resources: [
              { type: "video", label: "וידאו", url: "#" },
              { type: "link", label: "תבנית פרסונות", url: "#" },
            ],
          },
        ],
      },
      {
        title: "מיתוג ומסרים אסטרטגיים",
        lessons: [
          {
            title: "DNA מותג וקול ייחודי",
            duration: "40 ד׳",
            resources: [
              { type: "video", label: "וידאו", url: "#" },
              { type: "pdf", label: "מדריך מותג", url: "#" },
            ],
          },
          {
            title: "היררכיית מסרים ובדיקות",
            duration: "30 ד׳",
            resources: [
              { type: "video", label: "וידאו", url: "#" },
              { type: "slides", label: "שקפים", url: "#" },
            ],
          },
        ],
      },
      {
        title: "מערכות שיווק ואופטימיזציה",
        lessons: [
          {
            title: "מפעל תוכן חכם",
            duration: "45 ד׳",
            resources: [
              { type: "video", label: "וידאו", url: "#" },
              { type: "link", label: "מחולל תוכן", url: "#" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ai-marketing-systems",
    title: "AI Marketing Systems",
    category: "marketing",
    level: "intermediate",
    duration: "6 שעות · 2 מפגשים",
    description:
      "בניית מערכות שיווק מבוססות AI: משפכי מכירה, אוטומציות ואופטימיזציה להמרות.",
    modules: [
      {
        title: "תוכן שממיר",
        lessons: [
          {
            title: "ארכיטקטורת תוכן לפלטפורמות שונות",
            duration: "35 ד׳",
            resources: [
              { type: "video", label: "וידאו", url: "#" },
              { type: "pdf", label: "צ׳קליסט", url: "#" },
            ],
          },
        ],
      },
      {
        title: "אופטימיזציית המרות",
        lessons: [
          {
            title: "A/B Testing חכם",
            duration: "30 ד׳",
            resources: [
              { type: "slides", label: "מצגת", url: "#" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "prompt-engineering-tech",
    title: "Prompt Engineering Tech",
    category: "tech",
    level: "beginner",
    duration: "4 שעות · 1 מפגש",
    description:
      "יסודות פרומפטינג מעשיים לבניית תהליכי עבודה יעילים ויציבים.",
    modules: [
      {
        title: "יסודות",
        lessons: [
          {
            title: "מסגרות פרומפטינג",
            duration: "25 ד׳",
            resources: [
              { type: "video", label: "וידאו", url: "#" },
              { type: "pdf", label: "סיכום", url: "#" },
            ],
          },
        ],
      },
    ],
  },
];

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

const LearningPlatform: React.FC = () => {
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
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 sm:inline-flex">
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
                        <Card key={course.id} className="flex flex-col">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">{course.title}</CardTitle>
                              <Badge variant="secondary">{levelLabel[course.level]}</Badge>
                            </div>
                            <CardDescription>{course.description}</CardDescription>
                            <div className="mt-2 text-sm text-muted-foreground">
                              קטגוריה: {categoryLabel[course.category]} · משך: {course.duration}
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <Accordion type="single" collapsible className="w-full">
                              {course.modules.map((m, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`}>
                                  <AccordionTrigger className="text-base">
                                    {m.title}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="space-y-4">
                                      {m.lessons.map((lesson, li) => (
                                        <li key={li} className="rounded-md border p-4">
                                          <div className="flex items-center justify-between gap-4">
                                            <div>
                                              <p className="font-medium">{lesson.title}</p>
                                              {lesson.duration && (
                                                <p className="text-sm text-muted-foreground">משך: {lesson.duration}</p>
                                              )}
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-end">
                                              {lesson.resources.map((r, ri) => (
                                                <a
                                                  key={ri}
                                                  href={r.url}
                                                  onClick={(e) => r.url === "#" && e.preventDefault()}
                                                  className=""
                                                  aria-label={`${r.label} לשיעור ${lesson.title}`}
                                                >
                                                  <Button variant="outline" size="sm">
                                                    {resourceIcon(r.type)}
                                                    {r.label}
                                                  </Button>
                                                </a>
                                              ))}
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

function resourceIcon(type: Resource["type"]) {
  // lightweight inline icons (unicode) to avoid extra deps
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
}

export default LearningPlatform;
