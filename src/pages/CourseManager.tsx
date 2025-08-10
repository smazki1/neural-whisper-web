import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel as ShadFormLabel, FormMessage } from "@/components/ui/form";

// Local types to match DB schema
type CourseCategory = "strategy" | "marketing" | "tech";
type CourseLevel = "beginner" | "intermediate" | "advanced";
type ResourceType = "video" | "pdf" | "slides" | "link";

type Course = {
  id: string;
  user_id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string | null;
  description: string | null;
  published: boolean;
};

type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
};

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  duration: string | null;
  content: string | null;
  position: number;
};

type Resource = {
  id: string;
  lesson_id: string;
  type: ResourceType;
  label: string | null;
  url: string;
};

const categoryLabel: Record<CourseCategory, string> = {
  strategy: "אסטרטגיה",
  marketing: "שיווק",
  tech: "טכנולוגיה",
};

const levelLabel: Record<CourseLevel, string> = {
  beginner: "מתחילים",
  intermediate: "ביניים",
  advanced: "מתקדמים",
};

// Validation schemas
const CourseSchema = z.object({
  title: z.string().min(2, "שם הקורס חייב להכיל לפחות 2 תווים"),
  category: z.enum(["strategy", "marketing", "tech"], { required_error: "בחרו קטגוריה" }),
  level: z.enum(["beginner", "intermediate", "advanced"], { required_error: "בחרו רמה" }),
  duration: z.string().max(100).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  published: z.boolean().optional(),
});
export type CourseFormValues = z.infer<typeof CourseSchema>;

const ResourceSchema = z.object({
  lesson_id: z.string().min(1, "בחרו שיעור"),
  type: z.enum(["video", "pdf", "slides", "link"]),
  label: z.string().max(120).optional().nullable(),
  url: z.string().url("קישור לא תקין"),
});
export type ResourceFormValues = z.infer<typeof ResourceSchema>;

const CourseManager: React.FC = () => {
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const [loading, setLoading] = useState(false);

  // Edit state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // React Hook Form for Course
  const courseFormHook = useForm<CourseFormValues>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: "",
      category: "strategy",
      level: "beginner",
      duration: "",
      description: "",
      published: false,
    },
  });

  const onSubmitCourse = async (values: CourseFormValues) => {
    try {
      if (editingCourseId) {
        const { error } = await supabase
          .from("courses")
          .update({
            title: values.title,
            category: values.category,
            level: values.level,
            duration: values.duration ?? null,
            description: values.description ?? null,
            published: !!values.published,
          })
          .eq("id", editingCourseId);
        if (error) throw error;
        toast({ title: "הקורס עודכן" });
      } else {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) {
          toast({
            title: "נדרש להתחבר",
            description: "כדי ליצור קורס חדש, התחברו לחשבון",
            variant: "destructive",
          });
          return;
        }
        const { error } = await supabase.from("courses").insert({
          user_id: userId,
          title: values.title,
          category: values.category,
          level: values.level,
          duration: values.duration || null,
          description: values.description || null,
          published: !!values.published,
        });
        if (error) throw error;
        toast({ title: "קורס נוצר בהצלחה" });
      }
      courseFormHook.reset();
      setEditingCourseId(null);
      await loadAll();
    } catch (error: any) {
      toast({ title: "שגיאה בשמירה", description: error.message, variant: "destructive" });
    }
  };

  const [moduleForm, setModuleForm] = useState<{ course_id: string; title: string; description: string; position: number }>({
    course_id: "",
    title: "",
    description: "",
    position: 0,
  });

  const [lessonForm, setLessonForm] = useState<{ module_id: string; title: string; duration: string; content: string; position: number }>({
    module_id: "",
    title: "",
    duration: "",
    content: "",
    position: 0,
  });

  const [resourceForm, setResourceForm] = useState<{ lesson_id: string; type: ResourceType; label: string; url: string }>({
    lesson_id: "",
    type: "video",
    label: "",
    url: "",
  });

  const modulesByCourse = useMemo(() => {
    const map: Record<string, Module[]> = {};
    modules
      .slice()
      .sort((a, b) => a.position - b.position)
      .forEach((m) => {
        if (!map[m.course_id]) map[m.course_id] = [];
        map[m.course_id].push(m);
      });
    return map;
  }, [modules]);

  const lessonsByModule = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons
      .slice()
      .sort((a, b) => a.position - b.position)
      .forEach((l) => {
        if (!map[l.module_id]) map[l.module_id] = [];
        map[l.module_id].push(l);
      });
    return map;
  }, [lessons]);

  const resourcesByLesson = useMemo(() => {
    const map: Record<string, Resource[]> = {};
    resources.forEach((r) => {
      if (!map[r.lesson_id]) map[r.lesson_id] = [];
      map[r.lesson_id].push(r);
    });
    return map;
  }, [resources]);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Only the owner's courses are visible when authenticated (RLS). If not logged in, this will be empty.
      const { data: coursesData, error: cErr } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
      if (cErr) throw cErr;
      setCourses(coursesData || []);

      const courseIds = (coursesData || []).map((c) => c.id);
      if (courseIds.length === 0) {
        setModules([]);
        setLessons([]);
        setResources([]);
        return;
      }

      const { data: modulesData, error: mErr } = await supabase
        .from("modules")
        .select("*")
        .in("course_id", courseIds)
        .order("position", { ascending: true });
      if (mErr) throw mErr;
      setModules(modulesData || []);

      const moduleIds = (modulesData || []).map((m) => m.id);
      if (moduleIds.length === 0) {
        setLessons([]);
        setResources([]);
        return;
      }

      const { data: lessonsData, error: lErr } = await supabase
        .from("lessons")
        .select("*")
        .in("module_id", moduleIds)
        .order("position", { ascending: true });
      if (lErr) throw lErr;
      setLessons(lessonsData || []);

      const lessonIds = (lessonsData || []).map((l) => l.id);
      if (lessonIds.length === 0) {
        setResources([]);
        return;
      }

      const { data: resourcesData, error: rErr } = await supabase
        .from("resources")
        .select("*")
        .in("lesson_id", lessonIds);
      if (rErr) throw rErr;
      setResources(resourcesData || []);
    } catch (error: any) {
      toast({
        title: "שגיאה בטעינת נתונים",
        description: error.message || "בדקו שהנכם מחוברים לחשבון",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetCourseForm = () => {
    courseFormHook.reset({ title: "", category: "strategy", level: "beginner", duration: "", description: "", published: false });
    setEditingCourseId(null);
  };

  const handleSaveCourse = () => {
    courseFormHook.handleSubmit(onSubmitCourse)();
  };

  const handleEditCourse = (c: Course) => {
    setEditingCourseId(c.id);
    courseFormHook.reset({
      title: c.title,
      category: c.category,
      level: c.level,
      duration: c.duration || "",
      description: c.description || "",
      published: c.published,
    });
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("למחוק את הקורס? פעולה זו אינה הפיכה")) return;
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "קורס נמחק" });
      await loadAll();
    } catch (error: any) {
      toast({ title: "שגיאה במחיקה", description: error.message, variant: "destructive" });
    }
  };

  const handleAddModule = async () => {
    if (!moduleForm.course_id || !moduleForm.title) {
      toast({ title: "חסר מידע", description: "בחרו קורס והזינו כותרת למודול" });
      return;
    }
    try {
      const { error } = await supabase.from("modules").insert({
        course_id: moduleForm.course_id,
        title: moduleForm.title,
        description: moduleForm.description || null,
        position: moduleForm.position || 0,
      });
      if (error) throw error;
      setModuleForm({ course_id: moduleForm.course_id, title: "", description: "", position: 0 });
      await loadAll();
    } catch (error: any) {
      toast({ title: "שגיאה בהוספת מודול", description: error.message, variant: "destructive" });
    }
  };

  const handleAddLesson = async () => {
    if (!lessonForm.module_id || !lessonForm.title) {
      toast({ title: "חסר מידע", description: "בחרו מודול והזינו כותרת לשיעור" });
      return;
    }
    try {
      const { error } = await supabase.from("lessons").insert({
        module_id: lessonForm.module_id,
        title: lessonForm.title,
        duration: lessonForm.duration || null,
        content: lessonForm.content || null,
        position: lessonForm.position || 0,
      });
      if (error) throw error;
      setLessonForm({ module_id: lessonForm.module_id, title: "", duration: "", content: "", position: 0 });
      await loadAll();
    } catch (error: any) {
      toast({ title: "שגיאה בהוספת שיעור", description: error.message, variant: "destructive" });
    }
  };

  const handleAddResource = async () => {
    if (!resourceForm.lesson_id || !resourceForm.url) {
      toast({ title: "חסר מידע", description: "בחרו שיעור והזינו קישור" });
      return;
    }
    try {
      const { error } = await supabase.from("resources").insert({
        lesson_id: resourceForm.lesson_id,
        type: resourceForm.type,
        label: resourceForm.label || null,
        url: resourceForm.url,
      });
      if (error) throw error;
      setResourceForm({ lesson_id: resourceForm.lesson_id, type: resourceForm.type, label: "", url: "" });
      await loadAll();
    } catch (error: any) {
      toast({ title: "שגיאה בהוספת משאב", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>ניהול קורסים | AI Master</title>
        <meta name="description" content="ממשק ניהול קורסים: יצירה, עריכה וניהול מודולים, שיעורים ומשאבים." />
        <link rel="canonical" href="https://ai-master.co.il/courses/manage" />
      </Helmet>

      <Navbar onContactClick={() => {}} />

      <main className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">ניהול קורסים</h1>
        <p className="text-muted-foreground mb-8">
          שים לב: כדי ליצור ולעדכן נתונים יש להתחבר לחשבון Supabase. משתמשים לא מחוברים יראו רשימה ריקה (עקב RLS).
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>יצירת/עדכון קורס</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...courseFormHook}>
                <form onSubmit={courseFormHook.handleSubmit(onSubmitCourse)} className="space-y-4">
                  <FormField
                    control={courseFormHook.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <ShadFormLabel>שם הקורס</ShadFormLabel>
                        <FormControl>
                          <Input placeholder="לדוגמה: AI Business Mastery" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField
                      control={courseFormHook.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <ShadFormLabel>קטגוריה</ShadFormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר קטגוריה" />
                            </SelectTrigger>
                            <SelectContent className="z-[60]">
                              <SelectItem value="strategy">אסטרטגיה</SelectItem>
                              <SelectItem value="marketing">שיווק</SelectItem>
                              <SelectItem value="tech">טכנולוגיה</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={courseFormHook.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <ShadFormLabel>רמה</ShadFormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר רמה" />
                            </SelectTrigger>
                            <SelectContent className="z-[60]">
                              <SelectItem value="beginner">מתחילים</SelectItem>
                              <SelectItem value="intermediate">ביניים</SelectItem>
                              <SelectItem value="advanced">מתקדמים</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={courseFormHook.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <ShadFormLabel>משך</ShadFormLabel>
                          <FormControl>
                            <Input placeholder="לדוגמה: 9 שעות · 3 מפגשים" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={courseFormHook.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <ShadFormLabel>תיאור</ShadFormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="תיאור קצר של הקורס" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={courseFormHook.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3">
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          <ShadFormLabel className="m-0">פרסום קורס</ShadFormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button type="submit">{editingCourseId ? "עדכון" : "שמירה"}</Button>
                    {editingCourseId && (
                      <Button variant="outline" type="button" onClick={resetCourseForm}>ביטול עריכה</Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הוספת מודול / שיעור / משאב</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>מודול חדש</Label>
                <Select value={moduleForm.course_id} onValueChange={(v) => setModuleForm((p) => ({ ...p, course_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קורס" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="שם המודול" value={moduleForm.title} onChange={(e) => setModuleForm((p) => ({ ...p, title: e.target.value }))} />
                <Input placeholder="תיאור (אופציונלי)" value={moduleForm.description} onChange={(e) => setModuleForm((p) => ({ ...p, description: e.target.value }))} />
                <Input type="number" placeholder="מיקום" value={moduleForm.position} onChange={(e) => setModuleForm((p) => ({ ...p, position: Number(e.target.value) }))} />
                <Button onClick={handleAddModule}>הוסף מודול</Button>
              </div>

              <div className="space-y-3">
                <Label>שיעור חדש</Label>
                <Select value={lessonForm.module_id} onValueChange={(v) => setLessonForm((p) => ({ ...p, module_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מודול" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    {modules.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="שם השיעור" value={lessonForm.title} onChange={(e) => setLessonForm((p) => ({ ...p, title: e.target.value }))} />
                <Input placeholder="משך (אופציונלי)" value={lessonForm.duration} onChange={(e) => setLessonForm((p) => ({ ...p, duration: e.target.value }))} />
                <Textarea placeholder="תוכן/הערות (אופציונלי)" value={lessonForm.content} onChange={(e) => setLessonForm((p) => ({ ...p, content: e.target.value }))} />
                <Input type="number" placeholder="מיקום" value={lessonForm.position} onChange={(e) => setLessonForm((p) => ({ ...p, position: Number(e.target.value) }))} />
                <Button onClick={handleAddLesson}>הוסף שיעור</Button>
              </div>

              <div className="space-y-3">
                <Label>משאב חדש</Label>
                <Select value={resourceForm.lesson_id} onValueChange={(v) => setResourceForm((p) => ({ ...p, lesson_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר שיעור" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    {lessons.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={resourceForm.type} onValueChange={(v) => setResourceForm((p) => ({ ...p, type: v as ResourceType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="סוג" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    <SelectItem value="video">וידאו</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="slides">מצגת</SelectItem>
                    <SelectItem value="link">קישור</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="תווית (אופציונלי)" value={resourceForm.label} onChange={(e) => setResourceForm((p) => ({ ...p, label: e.target.value }))} />
                <Input placeholder="קישור" value={resourceForm.url} onChange={(e) => setResourceForm((p) => ({ ...p, url: e.target.value }))} />
                <Button onClick={handleAddResource}>הוסף משאב</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>הקורסים שלי {loading && <span className="text-sm text-muted-foreground">(טוען...)</span>}</CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-muted-foreground">לא נמצאו קורסים. התחברו וצרו קורס חדש.</p>
              ) : (
                <div className="grid gap-6">
                  {courses.map((c) => (
                    <div key={c.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">{c.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            קטגוריה: {categoryLabel[c.category]} · רמה: {levelLabel[c.level]} · {c.published ? "מפורסם" : "טיוטה"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => handleEditCourse(c)}>עריכה</Button>
                          <Button variant="destructive" onClick={() => handleDeleteCourse(c.id)}>מחיקה</Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="modules">
                            <AccordionTrigger>מודולים</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4">
                                {(modulesByCourse[c.id] || []).map((m) => (
                                  <div key={m.id} className="rounded-md border p-3">
                                    <div className="font-medium">{m.title}</div>
                                    <div className="text-sm text-muted-foreground">{m.description}</div>
                                    <div className="mt-2">
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="lessons">
                                          <AccordionTrigger>שיעורים</AccordionTrigger>
                                          <AccordionContent>
                                            <div className="space-y-3">
                                              {(lessonsByModule[m.id] || []).map((l) => (
                                                <div key={l.id} className="rounded border p-2">
                                                  <div className="font-medium">{l.title} {l.duration ? `· ${l.duration}` : ""}</div>
                                                  <div className="text-sm text-muted-foreground">{l.content}</div>
                                                  <div className="mt-2">
                                                    <div className="text-sm font-medium mb-1">משאבים</div>
                                                    <ul className="list-disc pr-5">
                                                      {(resourcesByLesson[l.id] || []).map((r) => (
                                                        <li key={r.id} className="text-sm">
                                                          <span className="font-medium">{r.type}</span> — <a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.label || r.url}</a>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseManager;
