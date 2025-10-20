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
        
        {/* Mission Section - First */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Target className="w-10 h-10 text-accent" />
                <h1 className="text-4xl lg:text-5xl font-bold">המשימה</h1>
              </div>
            </motion.div>

            <motion.div
              className="space-y-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-2xl lg:text-3xl font-semibold leading-relaxed">
                להעצים אנשים להגשים את עצמם<br />
                בעידן ה-AI
              </p>
              
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                לא דרך עוד מידע, פרומפטים מוכנים או טריקים מהירים.<br />
                אלא דרך בהירות - על מי אתם, מה אתם רוצים ליצור,<br />
                ואיך הכלים משרתים את המטרות והחזון שלכם.
              </p>

              <div className="pt-12 space-y-4">
                <p className="text-xl font-semibold">מה תמצאו כאן?</p>
                <div className="space-y-3 text-lg text-muted-foreground">
                  <p>להפוך את ה-AI לעוזר האישי שלכם,<br />לשותף לחשיבה וסיעור מוחות</p>
                  <p>בהירות לגבי הכלים הנכונים עבורכם</p>
                  <p>להכשיר צוותים לחשוב ביצירתיות בעידן החדש</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="max-w-2xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold">הבעיה האמיתית</h2>
              
              <div className="space-y-4 text-lg lg:text-xl text-muted-foreground leading-relaxed">
                <p>כולם מדברים על הכלים -<br />
                איזה גרסה יותר טובה, איזו טכניקה יעילה יותר.</p>
                
                <p>אף אחד לא מדבר על מה שבאמת חוסם אנשים:</p>
                
                <p className="font-semibold text-foreground">הם לא יודעים לתאר מה הם רוצים.</p>
                
                <p>לא יודעים להגדיר.<br />
                לא יודעים לנסח את המחשבה.<br />
                והכלים האלה דורשים בדיוק את זה.</p>
              </div>

              <div className="pt-8 space-y-4 text-lg">
                <p className="font-semibold">השורה התחתונה</p>
                <p className="text-muted-foreground">
                  הטכנולוגיה תמשיך להשתנות.<br />
                  תמיד יהיה כלי חדש.
                </p>
                <p className="text-foreground">
                  אבל אם אנחנו מפתחים גמישות מחשבתית,<br />
                  יצירתיות, ותשתית לחדשנות —<br />
                  אנחנו תמיד נהיה מוכנים לשינויים שיבואו.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-2xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold leading-snug">
                כולנו אמנים -<br />
                בין אם אנחנו רוצים את זה או לא
              </h2>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                לא משנה אם אתם עורכי דין, מהנדסים, חשבונאים.<br />
                בעידן החדש הזה, אתם חייבים לחשוב כמו אומנים.
              </p>

              <div className="pt-6 space-y-6 text-lg text-muted-foreground">
                <p className="font-semibold text-foreground">למה?</p>
                
                <p>כי הכלים האלה עוזרים לנו ליצור<br />את המציאות שאנחנו רוצים.</p>
                
                <p>אבל בשביל זה, אתם חייבים:</p>
                
                <div className="space-y-2">
                  <p>לדעת מה אתם רוצים ליצור</p>
                  <p>להסביר את החזון שלכם</p>
                  <p>לבטא את עצמכם בבהירות</p>
                </div>

                <p className="italic pt-4">
                  הכלים האלה מכריחים אותנו לחשוב כמו יוצרים,<br />
                  לא כמו מבצעים.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Image and Background Section */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {/* Image */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
                <div className="relative aspect-video">
                  <iframe
                    className="w-full h-full rounded-3xl"
                    src="https://www.youtube.com/embed/14bZqkWs5ng"
                    title="אבי פריד - מדריך AI ויזם טכנולוגי"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="text-center mt-8">
                <h2 className="text-4xl lg:text-5xl font-bold">אבי פריד</h2>
                <p className="text-xl text-muted-foreground mt-2">מדריך ומנטור יצירתי בעידן ה-AI</p>
              </div>
            </motion.div>

            {/* Background Info */}
            <motion.div
              className="space-y-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6 text-center">
                <h3 className="text-2xl lg:text-3xl font-bold">מה אני עושה היום</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  אני מעביר הדרכות וסדנאות לקהלים מגוונים.<br />
                  מלמד איך לעבוד עם הכלים בסביבה עסקית ומקצועית.<br />
                  איך להכשיר צוותים לחשוב ביצירתיות בעידן החדש.<br />
                  איך לנצל את הטכנולוגיה לא רק כדי לעשות דברים מהר יותר -<br />
                  אלא כדי לחשוב בצורה אחרת לגמרי.
                </p>
              </div>

              <div className="space-y-6 text-center">
                <h3 className="text-2xl lg:text-3xl font-bold">הרקע שלי</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  הניסיון שלי כיזם - פיתוח מיזמים בתחומים שונים,<br />
                  ניהול מערך כוח אדם ברחבי העולם, שותפות בסטארטאפ -<br />
                  נתן לי הבנה עמוקה של האתגרים האמיתיים שעסקים מתמודדים איתם.<br />
                  אני לא מדבר מהתיאוריה. אני מדבר מהשטח.
                </p>
              </div>

              <div className="space-y-6 text-center">
                <h3 className="text-2xl lg:text-3xl font-bold">למה אני כאן</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  אני מאמין שכוח ה-AI יכול להעצים אתכם.<br />
                  אני כאן להראות איך לנצל אותו:<br />
                  איך להפוך משהו שנראה טכני ומפחיד<br />
                  לכלי שמגשים את מה שאתם רוצים ליצור.<br />
                  לא להיות תלויים. להיות עצמאיים.<br />
                  להפוך את הטכנולוגיה לכלי להתפתחות האישית שלכם.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 lg:py-32">
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