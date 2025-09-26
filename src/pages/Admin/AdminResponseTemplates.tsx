import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResponseTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

const AdminResponseTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ResponseTemplate[]>([
    {
      id: "1",
      name: "תגובה ראשונית להרצאה",
      subject: "תודה על הפניה להרצאה - {service_type}",
      content: `שלום {name},

תודה על הפניה שלך להרצאה בנושא {service_interest}.

אני שמח לשמוע על העניין שלך והייתי רוצה לתאם איתך שיחה קצרה כדי להבין טוב יותר את הצרכים וההעדפות שלכם.

ההרצאות שלי מתאימות לקהלים מגוונים - מעובדי חברות טכנולוגיה ועד יזמים וסטודנטים. אני מתאים את התוכן לרמה ולמטרות הספציפיות של הקהל.

זמן הרצאה טיפוסי: 45-90 דקות
אפשרויות: פרונטלי או מקוון
כולל: חומרי למידה ומעקב

מתי נוח לך לשיחה קצרה של 15-20 דקות?

בברכה,
אבי פריד`,
      category: "הרצאה"
    },
    {
      id: "2", 
      name: "תגובה ראשונית לייעוץ",
      subject: "תודה על הפניה לייעוץ אישי",
      content: `היי {name},

תודה על הפניה שלך לייעוץ אישי!

קראתי את הפרטים שכתבת והייתי שמח לעזור לך {service_interest}.

הייעוץ שלי כולל:
- הערכה מדויקת של המצב הנוכחי שלך
- בניית אסטרטגיה מותאמת אישית
- כלים מעשיים ליישום מיידי
- מעקב והדרכה מתמשכת

השיחה הראשונה (עד 30 דקות) חינמית לגמרי, בה נכיר ונבין איך אני יכול לעזור לך הכי טוב.

מתי נוח לך לשיחת היכרות?

בהצלחה,
אבי`,
      category: "ייעוץ אישי"
    },
    {
      id: "3",
      name: "תגובה ראשונית לסדנה",
      subject: "תודה על העניין בסדנה - {service_interest}",
      content: `שלום {name},

תודה על הפניה לסדנה!

הסדנאות שלי הן מעשיות ואינטראקטיביות, מיועדות לתת כלים קונקרטיים שתוכלו ליישם מיד בעסק או בפרויקטים שלכם.

פרטי הסדנה:
- משך: 2-4 שעות (לפי התוכן)
- פורמט: מעשי עם תרגול בזמן אמת
- קבוצה: 8-25 משתתפים
- כולל: חומרי עזר ומעקב

אשמח לשמוע יותר על:
- גודל הקבוצה המתעניינת
- רמת הניסיון של המשתתפים
- מטרות ספציפיות שתרצו להשיג

מתי נוח לתאם שיחה קצרה?

בברכה,
אבי פריד`,
      category: "סדנה"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
    category: ""
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "הועתק ללוח",
      description: "התבנית הועתקה ללוח העריכה"
    });
  };

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    const template: ResponseTemplate = {
      id: Date.now().toString(),
      ...newTemplate
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: "", subject: "", content: "", category: "" });
    setIsAddModalOpen(false);
    
    toast({
      title: "נשמר בהצלחה",
      description: "התבנית נוספה למערכת"
    });
  };

  const deleteTemplate = (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק תבנית זו?")) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({
        title: "נמחק בהצלחה",
        description: "התבנית נמחקה מהמערכת"
      });
    }
  };

  const categories = Array.from(new Set(templates.map(t => t.category))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">תבניות תגובה</h2>
          <p className="text-muted-foreground">נהל תבניות תגובה מוכנות מראש לליידים</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              תבנית חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>יצירת תבנית חדשה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">שם התבנית</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="למשל: תגובה ראשונית להרצאה"
                  />
                </div>
                <div>
                  <Label htmlFor="category">קטגוריה</Label>
                  <Input
                    id="category"
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="למשל: הרצאה, ייעוץ, סדנה"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">נושא האימייל</Label>
                <Input
                  id="subject"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="תודה על הפניה - {service_interest}"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  ניתן להשתמש במשתנים: {"{name}, {email}, {service_interest}, {company}"}
                </p>
              </div>
              
              <div>
                <Label htmlFor="content">תוכן התגובה</Label>
                <Textarea
                  id="content"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="שלום {name},&#10;&#10;תודה על הפניה שלך..."
                  rows={8}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveTemplate}>שמור תבנית</Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  ביטול
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates
                .filter(template => template.category === category)
                .map(template => (
                  <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-foreground">{template.name}</h4>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">נושא:</Label>
                        <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                          {template.subject}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">תוכן:</Label>
                        <div className="bg-muted p-3 rounded mt-1 max-h-32 overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">
                            {template.content.substring(0, 200)}
                            {template.content.length > 200 && "..."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(template.content)}
                        >
                          <Copy className="w-3 h-3 ml-1" />
                          העתק
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingTemplate(template);
                            setNewTemplate({
                              name: template.name,
                              subject: template.subject,
                              content: template.content,
                              category: template.category
                            });
                            setIsAddModalOpen(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteTemplate(template.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          כיצד להשתמש בתבניות
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• לחץ "העתק" כדי להעתיק תבנית ללוח</p>
          <p>• השתמש במשתנים כמו {"{name}"} ו-{"{service_interest}"} להתאמה אישית</p>
          <p>• התבניות ייפתחו בתוכנת האימייל שלך עם התוכן המוכן</p>
          <p>• ניתן לערוך ולהתאים את התוכן לפני השליחה</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminResponseTemplates;