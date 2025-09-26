import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "השם הוא שדה חובה").max(100, "השם לא יכול להיות ארוך מ-100 תווים"),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255, "כתובת האימייל ארוכה מדי"),
  phone: z.string().trim().optional(),
  inquiryType: z.enum(["הרצאה", "סדנה", "ייעוץ אישי", "כללי"], {
    required_error: "נא בחר סוג פניה"
  }),
  message: z.string().trim().min(1, "ההודעה היא שדה חובה").max(2000, "ההודעה ארוכה מדי")
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    inquiryType: "כללי",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = contactSchema.parse(formData);
      setIsSubmitting(true);
      setErrors({});

      // Insert into leads table
      const { error } = await (supabase
        .from("leads")
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          service_interest: validatedData.inquiryType,
          message: validatedData.message,
          source: "Contact Page"
        }) as any);

      if (error) throw error;

      toast({
        title: "תודה על פנייתך!",
        description: "קיבלנו את הפניה שלך ונחזור אליך תוך 24 שעות.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "כללי",
        message: ""
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error submitting contact form:", error);
        toast({
          title: "שגיאה בשליחת הטופס",
          description: "אירעה שגיאה טכנית. אנא נסה שוב או פנה אלינו בדרך אחרת.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppUrl = () => {
    const baseMessage = `שלום אבי, אני מעוניין ב${formData.inquiryType}. `;
    const fullMessage = formData.message 
      ? `${baseMessage}${formData.message}` 
      : `${baseMessage}אשמח לשמוע פרטים נוספים.`;
    
    return `https://wa.me/972542000000?text=${encodeURIComponent(fullMessage)}`;
  };

  return (
    <>
      <Helmet>
        <title>יצירת קשר | AI Master - אבי פריד</title>
        <meta name="description" content="צור קשר עם אבי פריד למומחיות בבינה מלאכותית. הרצאות, סדנאות, ייעוץ אישי ופתרונות AI מותאמים אישית." />
        <meta name="keywords" content="יצירת קשר, אבי פריד, בינה מלאכותית, הרצאות, ייעוץ, סדנאות AI" />
        <meta property="og:title" content="יצירת קשר | AI Master" />
        <meta property="og:description" content="צור קשר עם אבי פריד למומחיות בבינה מלאכותית" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20">
        <motion.div 
          className="container mx-auto px-4 py-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header Section */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              בואו נתחיל לעבוד
              <span className="text-primary block mt-2">יחד</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              יש לך פרויקט מרתק? רעיון חדשני? או סתם רוצה לדבר על העתיד של הטכנולוגיה?
              <br />אני כאן כדי לעזור ולהדריך אותך בדרך.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <Card className="p-8 shadow-lg border-2 border-primary/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <Label htmlFor="name" className="text-base font-medium mb-2 block">
                        שם מלא *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="הכנס את שמך המלא"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <Label htmlFor="email" className="text-base font-medium mb-2 block">
                        כתובת אימייל *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone Field */}
                    <div>
                      <Label htmlFor="phone" className="text-base font-medium mb-2 block">
                        מספר טלפון
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="050-1234567"
                        dir="ltr"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        סוג הפניה *
                      </Label>
                      <Select 
                        value={formData.inquiryType} 
                        onValueChange={(value: any) => handleInputChange("inquiryType", value)}
                      >
                        <SelectTrigger className={errors.inquiryType ? "border-destructive" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="הרצאה">הרצאה</SelectItem>
                          <SelectItem value="סדנה">סדנה</SelectItem>
                          <SelectItem value="ייעוץ אישי">ייעוץ אישי</SelectItem>
                          <SelectItem value="כללי">כללי</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.inquiryType && (
                        <p className="text-destructive text-sm mt-1">{errors.inquiryType}</p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <Label htmlFor="message" className="text-base font-medium mb-2 block">
                      ההודעה שלך *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="ספר לי על הפרויקט שלך, המטרות שלך או איך אני יכול לעזור לך..."
                      rows={5}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 ml-2" />
                      {isSubmitting ? "שולח..." : "שלח הודעה"}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => window.open(generateWhatsAppUrl(), '_blank')}
                      className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      שלח בוואטסאפ
                      <ExternalLink className="w-3 h-3 mr-2" />
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>

            {/* Contact Information Sidebar */}
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Contact Details */}
              <Card className="p-6 shadow-lg border-2 border-primary/10">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  דרכי יצירת קשר
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">אימייל</p>
                      <a href="mailto:avi@ai-master.co.il" className="text-muted-foreground hover:text-primary">
                        avi@ai-master.co.il
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">טלפון</p>
                      <a href="tel:+972542000000" className="text-muted-foreground hover:text-primary">
                        054-200-0000
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">וואטסאפ</p>
                      <a 
                        href="https://wa.me/972542000000" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-green-600"
                      >
                        שלח הודעה
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">מיקום</p>
                      <p className="text-muted-foreground">ישראל</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Response Time */}
              <Card className="p-6 shadow-lg border-2 border-primary/10">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  זמני תגובה
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">פניות כלליות</p>
                      <p className="text-muted-foreground">תוך 24 שעות</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">וואטסאפ</p>
                      <p className="text-muted-foreground">תוך כמה שעות</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">פניות דחופות</p>
                      <p className="text-muted-foreground">תיאום מראש</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Service Types */}
              <Card className="p-6 shadow-lg border-2 border-primary/10">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  השירותים שלי
                </h3>
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-start p-2">
                    הרצאות לארגונים וחברות
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start p-2">
                    סדנאות AI מעשיות
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start p-2">
                    ייעוץ אסטרטגי אישי
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start p-2">
                    קורסים ותכניות הכשרה
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div 
            variants={fadeInUp} 
            className="mt-16 max-w-4xl mx-auto"
          >
            <Card className="p-8 shadow-lg border-2 border-primary/10">
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
                שאלות נפוצות
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    כמה זמן לוקח לקבל תגובה?
                  </h4>
                  <p className="text-muted-foreground">
                    אני מתחייב לחזור אליכם תוך 24 שעות בימי עסקים. לפניות דחופות, שלחו וואטסאפ.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    איך אני יכול לדעת איזה שירות מתאים לי?
                  </h4>
                  <p className="text-muted-foreground">
                    תאמתו את סוג הפניה בטופס או שלחו הודעה כללית - אני אעזור לכם לבחור את השירות המתאים.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    האם יש עלות לייעוץ ראשוני?
                  </h4>
                  <p className="text-muted-foreground">
                    שיחת הייעוץ הראשונית (עד 30 דקות) חינם לגמרי, כדי שנכיר ונבין איך אני יכול לעזור.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    איזה מידע כדאי לצרף לפניה?
                  </h4>
                  <p className="text-muted-foreground">
                    ספרו על המטרות שלכם, האתגרים הנוכחיים והציפיות מהשירות - זה יעזור לי להכין תגובה מדויקת יותר.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Contact;