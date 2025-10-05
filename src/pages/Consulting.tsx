import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Star,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Building,
  Lightbulb,
  Zap,
  Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import { Toaster } from '@/components/ui/toaster';

const Consulting = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    currentChallenge: '',
    timeline: '',
    budget: '',
    message: ''
  });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleContactClose = () => {
    setIsContactModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        service_interest: 'ייעוץ אישי',
        message: `סוג עסק: ${formData.businessType}
אתגר נוכחי: ${formData.currentChallenge}
לוח זמנים: ${formData.timeline}
תקציב: ${formData.budget}
הודעה נוספת: ${formData.message}`,
        source: 'consulting_page',
        status: 'new'
      };

      const { error } = await (supabase as any)
        .from('leads')
        .insert(leadData);

      if (error) throw error;

      toast({
        title: "פנייתך נשלחה בהצלחה!",
        description: "נחזור אליך תוך 24 שעות עם פרטי הייעוץ המותאם"
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        businessType: '',
        currentChallenge: '',
        timeline: '',
        budget: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "שגיאה בשליחת הפנייה",
        description: "אנא נסה שנית או פנה אלינו בטלפון",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const processSteps = [
    {
      step: 1,
      title: "שיחת היכרות ראשונית",
      description: "שיחה של 30 דקות להבנת הצרכים והמטרות שלך",
      icon: Phone,
      duration: "30 דקות"
    },
    {
      step: 2,
      title: "ניתוח מעמיק",
      description: "בחינה מקיפה של המצב הנוכחי והזדמנויות לשיפור",
      icon: Target,
      duration: "1-2 ימים"
    },
    {
      step: 3,
      title: "הצגת האסטרטגיה",
      description: "מפגש מפורט עם תוכנית פעולה מותאמת אישית",
      icon: Lightbulb,
      duration: "90 דקות"
    },
    {
      step: 4,
      title: "ליווי ביישום",
      description: "תמיכה ומעקב צמוד בהטמעת הפתרונות",
      icon: TrendingUp,
      duration: "עד 3 חודשים"
    }
  ];

  const targetAudience = [
    {
      icon: Building,
      title: "מנהלים ומנכ\"לים",
      description: "המעוניינים לשלב AI בתהליכים עסקיים ולקבל יתרון תחרותי"
    },
    {
      icon: Users,
      title: "יזמים ובעלי עסקים",
      description: "שרוצים להוביל חדשנות ולחסוך זמן וכסף באמצעות טכנולוגיה"
    },
    {
      icon: TrendingUp,
      title: "אנשי שיווק ומכירות",
      description: "המחפשים דרכים חכמות לשפר ביצועים ולהגדיל הכנסות"
    },
    {
      icon: Zap,
      title: "מקצועיים טכנולוגיים",
      description: "שמעוניינים להתעדכן ולהוביל פרויקטים של בינה מלאכותית"
    }
  ];

  const testimonials = [
    {
      content: "הייעוץ של אבי שינה לחלוטין את הדרך שבה אנחנו חושבים על טכנולוגיה בחברה. השקענו בפתרונות AI שחוסכים לנו מאות שעות עבודה חודשיות.",
      author: "מנכ\"ל חברת טכנולוgiה",
      company: "חברה בתחום הפינטק",
      rating: 5
    },
    {
      content: "האסטרטגיה שקיבלתי הייתה מעשית ובת ביצוע. תוך 3 חודשים הצלחנו להטמיע פתרונות שהגדילו את היעילות שלנו ב-40%.",
      author: "מנהלת שיווק",
      company: "סטארטאפ B2B",
      rating: 5
    },
    {
      content: "גישתו של אבי מאוד מקצועית וממוקדת תוצאות. המידע שקיבלתי היה עדכני ורלוונטי לתחום שלי, וההטמעה הייתה חלקה.",
      author: "יועץ עסקי",
      company: "משרד יעוץ אסטרטגי",
      rating: 5
    }
  ];

  const whatsIncluded = [
    "ניתוח מקיף של הצרכים והמטרות",
    "אסטרטגיה מותאמת אישית לעסק",
    "רשימת כלים וטכנולוגיות מומלצות",
    "תוכנית יישום מעשית ומדורגת",
    "מדריך מפורט להטמעה עצמית",
    "3 חודשי תמיכה ומעקב",
    "גישה לקהילה פרטית של לקוחות",
    "עדכונים שוטפים על טכנולוגיות חדשות"
  ];

  return (
    <>
      <Helmet>
        <title>ייעוץ אישי בבינה מלאכותית | AI Master</title>
        <meta name="description" content="ייעוץ אישי ומותאם לעסק שלך. אסטרטגיה מעשית להטמעת בינה מלאכותית שתחסוך לך זמן וכסף" />
        <meta name="keywords" content="ייעוץ AI, בינה מלאכותית לעסקים, אסטרטגיה טכנולוגית, ייעוץ עסקי, הטמעת AI" />
        <meta property="og:title" content="ייעוץ אישי בבינה מלאכותית | AI Master" />
        <meta property="og:description" content="קבל אסטרטגיה מותאמת אישית להטמעת בינה מלאכותית בעסק שלך" />
        <meta property="og:type" content="service" />
      </Helmet>

      <div className="min-h-screen bg-background pt-20" dir="rtl">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-white to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-brand-accent text-brand-text text-lg px-6 py-2 mb-6">
                ייעוץ אישי ומותאם
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-brand-text mb-6">
                הפוך את הבינה המלאכותית
                <span className="block premium-accent-gradient">לכוח העל של העסק שלך</span>
              </h1>
              
              <p className="text-2xl text-brand-text-secondary mb-8 leading-relaxed">
                ייעוץ אסטרטגי מותאם אישית שיעזור לך להטמיע AI בצורה חכמה ומעשית,
                <br className="hidden lg:block" />
                לחסוך זמן יקר ולהגדיל את הרווחיות
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  className="premium-button-primary text-xl px-8 py-4"
                  onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  קבע ייעוץ ראשוני חינם
                </Button>
                <Button 
                  variant="outline" 
                  className="text-xl px-8 py-4"
                  onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  איך זה עובד?
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-accent mb-2">95%</div>
                  <div className="text-brand-text-secondary">שביעות רצון לקוחות</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-accent mb-2">40%</div>
                  <div className="text-brand-text-secondary">חיסכון בזמן ממוצע</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-accent mb-2">200+</div>
                  <div className="text-brand-text-secondary">עסקים שהתייעצו איתי</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Overview */}
        <section id="process" className="py-20">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-brand-text mb-4">איך התהליך עובד?</h2>
              <p className="text-xl text-brand-text-secondary">מגישה ראשונית ועד ליישום מוצלח</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="modern-card h-full text-center hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="h-8 w-8 text-brand-text" />
                      </div>
                      
                      <div className="text-sm text-brand-accent font-semibold mb-2">
                        שלב {step.step}
                      </div>
                      
                      <h3 className="text-xl font-bold text-brand-text mb-3">
                        {step.title}
                      </h3>
                      
                      <p className="text-brand-text-secondary mb-4">
                        {step.description}
                      </p>
                      
                      <Badge variant="outline" className="text-brand-accent border-brand-accent">
                        {step.duration}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-20 bg-gradient-to-br from-white to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-brand-text mb-4">למי מתאים הייעוץ?</h2>
              <p className="text-xl text-brand-text-secondary">אם אתה מזדהה עם אחד מהפרופילים הבאים - זה בדיוק בשבילך</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {targetAudience.map((audience, index) => (
                <motion.div
                  key={audience.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="modern-card h-full hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          <audience.icon className="h-6 w-6 text-brand-text" />
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold text-brand-text mb-3">
                            {audience.title}
                          </h3>
                          <p className="text-brand-text-secondary leading-relaxed">
                            {audience.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-brand-text mb-6">
                  מה כלול בתהליך הייעוץ?
                </h2>
                
                <p className="text-xl text-brand-text-secondary mb-8">
                  חבילה מקיפה שמבטיחה הצלחה בהטמעת הבינה המלאכותית בעסק שלך
                </p>

                <div className="space-y-4">
                  {whatsIncluded.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="h-6 w-6 text-brand-accent flex-shrink-0" />
                      <span className="text-brand-text font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="modern-card border-2 border-brand-accent">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-brand-accent mb-2">
                        ₪4,997
                      </div>
                      <div className="text-brand-text-secondary">
                        חבילה מקיפה כולל 3 חודשי ליווי
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-text-secondary">שיחת היכרות</span>
                        <span className="text-brand-text font-semibold">חינם</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-text-secondary">ניתוח ואסטרטגיה</span>
                        <span className="text-brand-text font-semibold">₪2,997</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-text-secondary">ליווי 3 חודשים</span>
                        <span className="text-brand-text font-semibold">₪2,000</span>
                      </div>
                    </div>

                    <Button 
                      className="premium-button-primary w-full text-lg py-3"
                      onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      התחל עם שיחה חינם
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-brand-text-secondary">
                      <Shield className="h-4 w-4" />
                      <span>גביית תשלום רק לאחר שיחת ההיכרות</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-white to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-brand-text mb-4">מה אומרים הלקוחות?</h2>
              <p className="text-xl text-brand-text-secondary">סיפורי הצלחה אמיתיים מעסקים שעברו את התהליך</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="modern-card h-full hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-brand-text mb-6 italic leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="font-semibold text-brand-text">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-brand-text-secondary">
                          {testimonial.company}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking-form" className="py-20">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-brand-text mb-4">
                  מוכן להתחיל?
                </h2>
                <p className="text-xl text-brand-text-secondary">
                  מלא את הפרטים ונחזור אליך תוך 24 שעות עם הצעה מותאמת אישית
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="modern-card border-2 border-brand-accent">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-brand-text">
                      בואו נכיר - ספר לי על העסק שלך
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-brand-text">שם מלא *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="איך קוראים לך?"
                            required
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-brand-text">אימייל *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="example@company.com"
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone" className="text-brand-text">טלפון</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="050-1234567"
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="company" className="text-brand-text">שם החברה/העסק</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            placeholder="שם החברה שלך"
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="businessType" className="text-brand-text">איזה סוג עסק? *</Label>
                        <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="בחר את סוג העסק" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech">טכנולוגיה/הייטק</SelectItem>
                            <SelectItem value="ecommerce">מסחר אלקטרוני</SelectItem>
                            <SelectItem value="services">שירותים מקצועיים</SelectItem>
                            <SelectItem value="retail">קמעונאות</SelectItem>
                            <SelectItem value="manufacturing">תעשייה/ייצור</SelectItem>
                            <SelectItem value="healthcare">בריאות/רפואה</SelectItem>
                            <SelectItem value="education">חינוך</SelectItem>
                            <SelectItem value="finance">פיננסים/ביטוח</SelectItem>
                            <SelectItem value="marketing">שיווק/פרסום</SelectItem>
                            <SelectItem value="other">אחר</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="currentChallenge" className="text-brand-text">מה האתגר העיקרי שלך כרגע? *</Label>
                        <Textarea
                          id="currentChallenge"
                          value={formData.currentChallenge}
                          onChange={(e) => setFormData({...formData, currentChallenge: e.target.value})}
                          placeholder="למשל: מבזבזים הרבה זמן על משימות חוזרות, רוצים לשפר שירות לקוחות, צריכים לייעל תהליכים..."
                          rows={3}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="timeline" className="text-brand-text">מתי רוצה להתחיל?</Label>
                          <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="לוח זמנים" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediately">מיד</SelectItem>
                              <SelectItem value="month">תוך חודש</SelectItem>
                              <SelectItem value="quarter">תוך 3 חודשים</SelectItem>
                              <SelectItem value="planning">בשלב תכנון</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="budget" className="text-brand-text">תקציב משוער</Label>
                          <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="טווח תקציב" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-5k">עד 5,000 ₪</SelectItem>
                              <SelectItem value="5k-15k">5,000-15,000 ₪</SelectItem>
                              <SelectItem value="15k-30k">15,000-30,000 ₪</SelectItem>
                              <SelectItem value="over-30k">מעל 30,000 ₪</SelectItem>
                              <SelectItem value="flexible">גמיש</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-brand-text">רוצה לספר עוד משהו?</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="כל מידע נוסף שיעזור לי להכין ייעוץ מותאם בדיוק לצרכים שלך..."
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="premium-button-primary w-full text-xl py-4"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'שולח...' : 'שלח פנייה לייעוץ'}
                      </Button>
                      
                      <p className="text-sm text-brand-text-secondary text-center">
                        * שיחת הייעוץ הראשונית חינם ללא התחייבות
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
      <Toaster />
    </>
  );
};

export default Consulting;