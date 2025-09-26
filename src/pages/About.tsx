import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Quote, MapPin, Calendar, Users, TrendingUp, Heart, Coffee, BookOpen, Lightbulb, Target, Award } from "lucide-react";
import aviPhoto from "@/assets/avi-fried-photo.jpg";
import { Helmet } from "react-helmet-async";

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const milestones = [
    {
      year: "2020",
      title: "תחילת המסע בעולם הבינה המלאכותית",
      description: "גילוי הפוטנציאל העצום של AI ותחילת ההתמחות בתחום",
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      year: "2021",
      title: "הקמת AI Master",
      description: "יצירת הפלטפורמה הראשונה להכשרה בבינה מלאכותית בישראל",
      icon: <Target className="w-5 h-5" />
    },
    {
      year: "2022",
      title: "1,000 תלמידים ראשונים",
      description: "הגעה לאבן דרך משמעותיות עם קהילה של אלפי לומדים",
      icon: <Users className="w-5 h-5" />
    },
    {
      year: "2023",
      title: "הרחבת המומחיות",
      description: "פיתוח קורסים מתקדמים ושיתופי פעולה עם חברות מובילות",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      year: "2024",
      title: "מובילה בתחום",
      description: "הכרה כאחד ממובילי החדשנות בבינה מלאכותית בישראל",
      icon: <Award className="w-5 h-5" />
    }
  ];

  const testimonials = [
    {
      quote: "אבי שינה את הדרך שלי לחשוב על עסק. הקורסים שלו לא רק לימדו אותי טכנולוגיה, אלא איך לחשוב אסטרטגית על העתיד.",
      author: "שרה כהן",
      role: "מנהלת שיווק, חברת היי-טק"
    },
    {
      quote: "הגישה המעשית והחמה של אבי עזרה לי להבין שבינה מלאכותית זה לא רק טכנולוגיה - זה כלי לשיפור החיים שלנו.",
      author: "דוד לוי",
      role: "יזם ומייסד סטארטאפ"
    },
    {
      quote: "אבי הוא לא רק מרצה מעולה, הוא מנטור אמיתי שמאמין בכל תלמיד וקהילה שלו.",
      author: "מיכל רוזן",
      role: "מפתחת תוכנה"
    }
  ];

  const personalInterests = [
    { icon: <Coffee className="w-6 h-6" />, title: "אוהב קפה טוב", description: "מתחיל כל בוקר עם כוס קפה מעולה ומחשבות על עתיד הטכנולוגיה" },
    { icon: <BookOpen className="w-6 h-6" />, title: "קורא בלתי נלאה", description: "תמיד עם ספר בתיק, מעדיף ביוגרפיות של חדשנים ומובילים" },
    { icon: <Heart className="w-6 h-6" />, title: "אב גאה", description: "השראה יומיומית מהילדים שלי ומהסקרנות הטבעית שלהם" },
    { icon: <MapPin className="w-6 h-6" />, title: "מטייל בעולם", description: "אוהב לגלות תרבויות חדשות ללמוד איך טכנולוגיה משפיעה על חיים בכל מקום" }
  ];

  return (
    <>
      <Helmet>
        <title>אודות אבי פריד | AI Master - מומחה בינה מלאכותית</title>
        <meta name="description" content="הכירו את אבי פריד, מייסד AI Master ומומחה בבינה מלאכותית. סיפור אישי, מומחיות מקצועית וגישה חדשנית לחינוך דיגיטלי." />
        <meta name="keywords" content="אבי פריד, AI Master, בינה מלאכותית, חינוך דיגיטלי, מומחה AI" />
        <meta property="og:title" content="אודות אבי פריד | AI Master" />
        <meta property="og:description" content="הכירו את אבי פריד, מייסד AI Master ומומחה בבינה מלאכותית" />
        <meta property="og:image" content={aviPhoto} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInUp} className="text-center lg:text-right order-2 lg:order-1">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  שלום, אני 
                  <span className="text-primary block mt-2">אבי פריד</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  מייסד AI Master, מומחה בינה מלאכותית וחסיד של החינוך הדיגיטלי. 
                  אני מאמין שטכנולוגיה צריכה להיות נגישה לכולם ולשרת את האנושות.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    בואו נכיר
                  </Button>
                  <Button size="lg" variant="outline">
                    המסע שלי
                  </Button>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="relative order-1 lg:order-2">
                <div className="relative w-80 h-80 mx-auto">
                  <img 
                    src={aviPhoto} 
                    alt="אבי פריד - מומחה בינה מלאכותית"
                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-primary/20"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Personal Story Section */}
        <section className="py-16 px-4 bg-muted/30">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">הסיפור שלי</h2>
              <p className="text-lg text-muted-foreground">מהמשבר האישי לחזון שמשנה חיים</p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 shadow-lg border-2 border-primary/10">
                <Quote className="w-8 h-8 text-primary mb-4" />
                <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    הדרך שלי לעולם הבינה המלאכותית התחילה ממקום לא צפוי. לפני כמה שנים, כשהעסק שלי 
                    עמד להיסגר והרגשתי שאני מפסיד כיוון, גיליתי את הכוח של הטכנולוגיות החדשות.
                  </p>
                  <p>
                    במקום להיכנע, החלטתי ללמוד. לא רק ללמוד - אלא לטבול לעומק, להבין איך AI 
                    יכול לשנות לא רק עסקים, אלא חיים שלמים.
                  </p>
                  <p>
                    היום, אחרי שעזרתי לאלפי אנשים לגלות את הכוח הזה, אני מבין שהמשימה שלי היא 
                    לא רק ללמד טכנולוגיה - אלא לחבר בין אנשים לעתיד שלהם.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">אבני הדרך</h2>
              <p className="text-lg text-muted-foreground">המסע מהחלום לביצוע</p>
            </motion.div>

            <div className="relative">
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={milestone.year}
                  variants={fadeInUp}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-primary text-primary-foreground p-3 rounded-full mb-2">
                      {milestone.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {milestone.year}
                    </Badge>
                    {index < milestones.length - 1 && (
                      <div className="w-px h-16 bg-border mt-4" />
                    )}
                  </div>
                  <Card className="flex-1 p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 px-4 bg-muted/30">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">הפילוסופיה שלי</h2>
              <p className="text-lg text-muted-foreground">איך אני רואה את עתיד החינוך והטכנולוגיה</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="p-6 h-full shadow-lg border-2 border-primary/10">
                  <Target className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    למידה מעשית וחוויתית
                  </h3>
                  <p className="text-muted-foreground">
                    אני מאמין שלמידה אמיתית קורית כשאנשים יכולים לגעת, להתנסות ולראות תוצאות מיידיות. 
                    לכן כל הקורסים שלי בנויים סביב פרויקטים אמיתיים שמביאים ערך מיידי.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-6 h-full shadow-lg border-2 border-primary/10">
                  <Heart className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    טכנולוגיה עם לב
                  </h3>
                  <p className="text-muted-foreground">
                    בינה מלאכותית היא לא רק אלגוריתמים וקוד - היא כלי לשיפור איכות החיים. 
                    אני מלמד איך להשתמש בטכנולוגיה כדי לפתור בעיות אמיתיות ולהקל על בני אדם.
                  </p>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">הישגים ומספרים</h2>
              <p className="text-lg text-muted-foreground">הקהילה שבנינו יחד</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { number: "5,000+", label: "תלמידים" },
                { number: "50+", label: "קורסים" },
                { number: "98%", label: "שביעות רצון" },
                { number: "200+", label: "חברות שהכשרנו" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <Card className="p-6 shadow-lg border-2 border-primary/10">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-muted/30">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">מה אומרים עליי</h2>
              <p className="text-lg text-muted-foreground">עדויות מהקהילה שלנו</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="p-6 h-full shadow-lg border-2 border-primary/10">
                    <Quote className="w-6 h-6 text-primary mb-4" />
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <Separator className="my-4" />
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Personal Interests Section */}
        <section className="py-16 px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">מעבר לטכנולוגיה</h2>
              <p className="text-lg text-muted-foreground">מי שאני כשהמחשב כבוי</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {personalInterests.map((interest, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="p-6 shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="text-primary">
                        {interest.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {interest.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {interest.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary/5">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              מוכנים להצטרף למסע?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              בואו נגלה יחד איך בינה מלאכותית יכולה לשנות את העתיד שלכם
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = '/consulting'}
              >
                בואו נדבר
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/products'}
              >
                הקורסים שלי
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default About;