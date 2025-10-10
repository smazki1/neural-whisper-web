import React, { useState } from 'react';
import { motion } from "framer-motion";
import aviPortrait from "@/assets/avi-fried-portrait.png";
import { Helmet } from "react-helmet-async";
import { Compass, Lightbulb, Target, Sparkles } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { Toaster } from '@/components/ui/toaster';

const About = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleContactClose = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>אודות אבי פריד | AI Master</title>
        <meta name="description" content="הכירו את אבי פריד - מדריך ומנטור יצירתי בעידן ה-AI, יזם ומומחה להעצמת אנשים להגשמה עצמית" />
        <meta name="keywords" content="אבי פריד, AI, בינה מלאכותית, הדרכות AI, מנטורינג" />
        <meta property="og:title" content="אודות אבי פריד | AI Master" />
        <meta property="og:description" content="הכירו את אבי פריד - מדריך ומנטור יצירתי בעידן ה-AI" />
        <meta property="og:image" content={aviPortrait} />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar onContactClick={handleContactClick} />
        
        {/* Hero Section with Image */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <motion.div
                className="relative order-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={aviPortrait}
                      alt="אבי פריד - מדריך AI ויזם טכנולוגי"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full blur-sm" />
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-accent/10 rounded-full blur-md" />
              </motion.div>

              {/* Content */}
              <motion.div
                className="order-2 space-y-6"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold">
                  <span className="block premium-accent-gradient">אבי פריד</span>
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
                <p className="text-xl lg:text-2xl text-muted-foreground">
                  מדריך ומנטור יצירתי בעידן ה-AI
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <Target className="w-10 h-10 text-accent" />
                <h2 className="text-4xl lg:text-5xl font-bold">המשימה</h2>
              </div>
            </motion.div>

            <motion.div
              className="space-y-8 text-lg lg:text-xl leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xl lg:text-2xl font-semibold text-center">
                להעצים אנשים להגשים את עצמם בעידן ה-AI
              </p>
              
              <p className="text-muted-foreground">
                לא דרך עוד מידע, פרומפטים מוכנים או טריקים מהירים. אלא דרך בהירות - על מי אתם, מה אתם רוצים ליצור, ואיך הכלים משרתים את המטרות והחזון שלכם.
              </p>

              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <Lightbulb className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">שותף לחשיבה</h3>
                  <p className="text-sm text-muted-foreground">להפוך את ה-AI לעוזר האישי שלכם, לשותף לחשיבה וסיעור מוחות</p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <Compass className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">בהירות</h3>
                  <p className="text-sm text-muted-foreground">הכוונה לכלים הנכונים עבורכם ואיך לנצל אותם</p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <Sparkles className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">יצירתיות</h3>
                  <p className="text-sm text-muted-foreground">להכשיר צוותים לחשוב ביצירתיות בעידן החדש</p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border-2 border-accent/20 mt-8">
                <h3 className="text-xl font-bold mb-4">הבעיה האמיתית</h3>
                <p className="text-muted-foreground">
                  כולם מדברים על הכלים - איזה גרסה יותר טובה, איזו טכניקה יעילה יותר. אף אחד לא מדבר על מה שבאמת חוסם אנשים: הם לא יודעים לתאר מה הם רוצים. לא יודעים להגדיר. לא יודעים לנסח את המחשבה. והכלים האלה דורשים בדיוק את זה.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-8 text-lg lg:text-xl leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
                כולנו אמנים - בין אם אנחנו רוצים את זה או לא
              </h2>

              <p>
                לא משנה אם אתם עורכי דין, מהנדסים, חשבונאים. בעידן החדש הזה, אתם חייבים לחשוב כמו אומנים.
              </p>

              <div className="bg-muted/50 p-8 rounded-xl space-y-4">
                <p className="font-semibold">כי הכלים האלה עוזרים לנו ליצור את המציאות שאנחנו רוצים.</p>
                <p className="text-muted-foreground">אבל בשביל זה, אתם חייבים:</p>
                <ul className="space-y-2 mr-6 text-muted-foreground">
                  <li>• לדעת מה אתם רוצים ליצור</li>
                  <li>• להסביר את החזון שלכם</li>
                  <li>• לבטא את עצמכם בבהירות</li>
                </ul>
              </div>

              <p className="text-center italic text-muted-foreground">
                הכלים האלה מכריחים אותנו לחשוב כמו יוצרים, לא כמו מבצעים.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Background Section */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold">מה אני עושה היום</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  אני מעביר הדרכות וסדנאות לקהלים מגוונים. מלמד איך לעבוד עם הכלים בסביבה עסקית ומקצועית. איך להכשיר צוותים לחשוב ביצירתיות בעידן החדש. איך לנצל את הטכנולוגיה לא רק כדי לעשות דברים מהר יותר - אלא כדי לחשוב בצורה אחרת לגמרי.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold">הרקע שלי</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  הניסיון שלי כיזם - פיתוח מיזמים בתחומים שונים, ניהול מערך כוח אדם ברחבי העולם, שותפות בסטארטאפ - נתן לי הבנה עמוקה של האתגרים האמיתיים שעסקים מתמודדים איתם. אני לא מדבר מהתיאוריה. אני מדבר מהשטח.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold">למה אני כאן</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  אני מאמין שכוח ה-AI יכול להעצים אתכם. אני כאן להראות איך לנצל אותו: איך להפוך משהו שנראה טכני ומפחיד לכלי שמגשים את מה שאתם רוצים ליצור. לא להיות תלויים. להיות עצמאיים. להפוך את הטכנולוגיה לכלי להתפתחות האישית שלכם.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final Section: אתם האומן + CTA */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
            <motion.div
              className="bg-card border-2 border-primary/20 rounded-2xl p-10 lg:p-16 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8 text-center">
                <h3 className="text-3xl lg:text-5xl font-bold text-foreground">
                  אתם האומן. יש לכם חזון.
                </h3>
                
                
                
                <div className="py-4">
                  <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full" />
                </div>
                
                <div className="space-y-5 text-lg lg:text-xl text-foreground/90">
                  <p>ה-AI הוא הכלי שלכם - המכחול, האזמל, הפטיש.</p>
                  <p className="text-muted-foreground">הוא לא יוצר את החזון.</p>
                  <div className="space-y-2 font-medium">
                    <p>אתם רואים את החזון.</p>
                    <p>אתם מחליטים.</p>
                    <p>אתם נותנים את הנשמה.</p>
                  </div>
                </div>
                
                <div className="py-4">
                  <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full" />
                </div>
                
                <p className="text-xl lg:text-2xl text-muted-foreground">
                  והכלי? הוא מוריד את האבנים הכבדות מהדרך.
                </p>
                
                <p className="text-3xl lg:text-4xl font-bold text-primary pt-4">
                  אין יותר מקום לחלומות קטנים.
                </p>
                
                <div className="pt-8">
                  <a
                    href="/products"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-lg font-semibold"
                  >
                    המסע מתחיל כאן
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
      <Toaster />
    </>
  );
};

export default About;