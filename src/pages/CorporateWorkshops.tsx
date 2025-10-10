import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import { SEOHead } from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import aiBeginnersImage from '@/assets/workshops/ai-beginners.jpg';
import chatMasteryImage from '@/assets/workshops/chat-mastery.jpg';
import aiAdvancedImage from '@/assets/workshops/ai-advanced.jpg';
import automationImage from '@/assets/workshops/automation.jpg';
import aiManagersImage from '@/assets/workshops/ai-managers.jpg';
import aiSalesImage from '@/assets/workshops/ai-sales.jpg';

const CorporateWorkshops = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    webhookUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const courses = [
    {
      title: 'סדנת AI בינה מלאכותית למתחילים',
      description: 'היכרות עם עולם ה-AI, כלים מדהימים זמינים לשימוש מיידי, ותרגול מעשי. מתאימה לצוותים ולמנהלים בכל המקצועות.',
      url: 'https://www.mash.org.il/סדנאות/סדנת-ai-בינה-מלאכותית-למתחילים-השקעה-חכמה-לעובדים-למנהלים-ולארגון',
      image: aiBeginnersImage
    },
    {
      title: 'קורס להוציא את המיטב מהצ\'טים',
      description: 'שליטה מתקדמת ב-ChatGPT, Claude, Copilot ו-Gemini ליצירת תוכן, תכנון פרויקטים ואוטומציה של תהליכים.',
      url: 'https://www.mash.org.il/סדנאות/להוציא-את-המיטב-מהצטים-שליטה-מתקדמת-בטכנולוגיות-generative-ai',
      image: chatMasteryImage
    },
    {
      title: 'סדנת AI למתקדמים',
      description: 'שליטה מתקדמת בטכנולוגיות Generative AI, יצירת תוכן, אוטומציה ושיפור תהליכי עבודה. יתרון תחרותי משמעותי.',
      url: 'https://www.mash.org.il/סדנאות/סדנת-ai-בינה-מלאכותית-למתקדמים-החדשנות-שמניעה-את-הארגון-למצוינות',
      image: aiAdvancedImage
    },
    {
      title: 'קורס אוטומציה ובינה מלאכותית',
      description: 'יישום פתרונות אוטומציה מבוססי AI למכירות, ניהול, שירות לקוחות, משאבי אנוש וניהול פרויקטים. ללא צורך בידע תכנותי.',
      url: 'https://www.mash.org.il/סדנאות/קורס-אוטומציה-ובינה-מלאכותית-ai',
      image: automationImage
    },
    {
      title: 'סדנת AI למנהלים',
      description: 'כלים ומיומנויות לקבלת החלטות ניהוליות, ארגוניות ועסקיות טובות יותר באמצעות AI.',
      url: 'https://www.mash.org.il/סדנאות/קורס-ai-בינה-מלאכותית-למנהלים-כלים-ומיומנויות-שמנהלים-חייבים-להכיר',
      image: aiManagersImage
    },
    {
      title: 'סדנת AI לאנשי מכירות',
      description: 'כלים ומיומנויות חדשניות להגדלת מכירות באמצעות בינה מלאכותית.',
      url: 'https://www.mash.org.il/סדנאות/סדנת-ai-בינה-מלאכותית-לאנשי-מכירות-כיצד-להשתמש-ב-ai-כדי-להגדיל-את-המכירות-שלכם',
      image: aiSalesImage
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.company || !formData.email || !formData.phone) {
      toast({
        title: "שגיאה",
        description: "אנא מלאו את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    if (!formData.webhookUrl) {
      toast({
        title: "שגיאה",
        description: "אנא הזינו כתובת Webhook",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke('send-contact-form', {
        body: formData
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "הטופס נשלח בהצלחה!",
        description: "נחזור אליכם בהקדם האפשרי",
      });

      // Reset form
      setFormData({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        message: '',
        webhookUrl: ''
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "שגיאה בשליחת הטופס",
        description: error.message || "אנא נסו שוב מאוחר יותר",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <SEOHead
        title="סדנאות והדרכות AI לארגונים - AI Master"
        description="סדנאות והדרכות AI מותאמות לארגונים בשיתוף משכּוּכית. הכשרת עובדים ומנהלים לשימוש יעיל בבינה מלאכותית."
        keywords="סדנאות AI, הדרכות AI לארגונים, קורסי בינה מלאכותית, משכּוּכית"
        canonical="https://ai-master.co.il/corporate-workshops"
        type="website"
      />
      
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar onContactClick={() => setIsContactModalOpen(true)} />
        
        <main id="main-content" className="pt-24">
          {/* Hero Section */}
          <section className="py-16 md:py-24 professional-section-bg">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold professional-text-primary mb-8 leading-tight">
                  סדנאות והדרכות <span className="professional-text-accent">AI לארגונים</span>
                </h1>
              </motion.div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-12 md:py-20 professional-section-alt">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="professional-card p-8 md:p-12"
              >
                <p className="text-lg md:text-xl professional-text-body leading-relaxed mb-6">
                  הדרכת AI מוצלחת צריכה שני דברים: הבנה עמוקה של הטכנולוגיה, והבנה עמוקה של ארגונים.
                </p>
                <p className="text-lg md:text-xl professional-text-body leading-relaxed mb-6">
                  לכן חיברתי כוחות עם <strong>משכּוּכית</strong> - אחת מחברות הייעוץ וההדרכה הארגונית המובילות בישראל.
                </p>
                <p className="text-lg md:text-xl professional-text-body leading-relaxed mb-6">
                  אני מתמקד במה שהכלים לא יכולים ללמד לבד - איך לחשוב בבהירות, איך לדעת מה רוצים באמת, ואיך להפוך את ה-AI לכוח משמעותי. משכּוּכית מתמחה במה שארגונים צריכים כדי שהדברים באמת יקרו - הטמעה, שינוי, ובניית תכניות שעובדות לאורך זמן.
                </p>
                <p className="text-lg md:text-xl professional-text-body leading-relaxed font-semibold">
                  ביחד? סדנאות שלא רק מלמדות כלים, אלא משנות את הדרך שבה כולם עובדים.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Courses Section */}
          <section className="py-16 md:py-24 professional-section-bg">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold professional-text-primary text-center mb-12 md:mb-16"
              >
                הסדנאות שלנו
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {courses.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="professional-card h-full hover:shadow-xl transition-all duration-500 group overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl md:text-2xl professional-text-primary group-hover:text-accent transition-colors duration-300">
                          {course.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col">
                        <CardDescription className="text-base professional-text-body leading-relaxed mb-6">
                          {course.description}
                        </CardDescription>
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-auto"
                        >
                          <Button className="w-full premium-button-primary group/btn" size="lg">
                            <span>לפרטים נוספים</span>
                            <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* All Courses Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-12 md:mt-16"
              >
                <a
                  href="https://www.mash.org.il/סדנאות/.c/סדנאות-וקורסים-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="premium-button-primary text-lg px-10 py-6" size="lg">
                    <span>לכל הקורסים והסדנאות</span>
                    <ExternalLink className="mr-3 h-5 w-5" />
                  </Button>
                </a>
              </motion.div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 md:py-24 professional-section-alt">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold professional-text-primary text-center mb-4">
                  נשמח לשמוע מכם
                </h2>
                <p className="text-lg professional-text-body text-center mb-12">
                  מעוניינים בסדנה או הדרכה לארגון? מלאו את הפרטים ונחזור אליכם בהקדם:
                </p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="professional-card">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="professional-text-primary">
                            שם מלא <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="professional-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company" className="professional-text-primary">
                            שם החברה/ארגון <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleInputChange}
                            required
                            className="professional-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="professional-text-primary">
                            אימייל <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="professional-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="professional-text-primary">
                            טלפון <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="professional-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="professional-text-primary">
                            הודעה
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="professional-input resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="webhookUrl" className="professional-text-primary">
                            כתובת Webhook <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="webhookUrl"
                            name="webhookUrl"
                            type="url"
                            value={formData.webhookUrl}
                            onChange={handleInputChange}
                            placeholder="https://hooks.zapier.com/..."
                            required
                            className="professional-input"
                          />
                          <p className="text-sm text-muted-foreground">
                            הזינו את כתובת ה-Webhook שלכם (Zapier, Make, וכו׳)
                          </p>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full premium-button-primary text-lg py-6" 
                          size="lg"
                          disabled={isSubmitting}
                        >
                          <span>{isSubmitting ? 'שולח...' : 'שלח'}</span>
                          <Send className="mr-3 h-5 w-5" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </div>
    </>
  );
};

export default CorporateWorkshops;
