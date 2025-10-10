import React, { useState } from 'react';
import { motion } from "framer-motion";
import aviProfile from "@/assets/avi-fried-photo.jpg";
import { Helmet } from "react-helmet-async";
import { Compass } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { Toaster } from '@/components/ui/toaster';

//

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
        <meta property="og:image" content={aviProfile} />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar onContactClick={handleContactClick} />
        {/* Section 1 content removed to match Lovable sync point */}

        {/* Section 2: המשימה */}
        <section className="pt-20 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-20 xl:px-32 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            {/* Header with Icon */}
            <motion.div 
              className="flex items-center justify-center gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              dir="rtl"
            >
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground">המשימה</h2>
              <Compass className="w-14 h-14 lg:w-16 lg:h-16 text-[hsl(45,100%,51%)] flex-shrink-0" strokeWidth={2.5} />
            </motion.div>

            {/* Content */}
            <motion.div 
              className="space-y-6 text-lg leading-relaxed text-foreground/90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="max-w-3xl ml-auto">להעצים אנשים להגשים את עצמם בעידן ה-AI.<br />
              לא דרך עוד מידע, פרומפטים מוכנים או טריקים מהירים. אלא דרך בהירות - על מי את/ה, מה את/ה רוצה ליצור, ואיך הכלים משרתים את המטרות והחזון שלך.</p>

              <p className="text-2xl font-bold">מה תמצאו כאן?</p>
              <p>להפוך את ה-AI לעוזר האישי שלך, לשותף לחשיבה וסיעור מוחות.</p>
              <p>בהירות לגביי הכלים הנכונים בשבילך</p>
              <p>להכשיר צוותים לחשוב ביצירתיות בעידן החדש</p>

              <p>זה לא קורס תכנות. זה לא מדריך "לחצו כאן". זה לא פתרון קסם - זאת גישה חדשה.</p>

              <p className="text-2xl font-bold">הבעיה האמיתית</p>
              <p>כולם מדברים על הכלים - איזה גרסה יותר טובה, איזו טכניקה יעילה יותר.<br />
              אף אחד לא מדבר על מה שבאמת חוסם אנשים: הם לא יודעים לתאר מה הם רוצים.<br />
              לא יודעים להגדיר. לא יודעים לנסח את המחשבה. והכלים האלה דורשים בדיוק את זה.</p>

              <p className="text-2xl font-bold">השורה התחתונה</p>
              <p>הטכנולוגיה תמשיך להשתנות. תמיד יהיה כלי חדש.<br />
              אבל אם את/ה ברורה - את/ה תמיד תדע/י מה לעשות איתה.</p>
              <p>אני לא מלמד אותך AI. אני מלמד אותך להיות בגרסה הכי טובה שלך בעידן הדיגיטלי החדש.</p>
            </motion.div>
          </div>
        </section>

        {/* Section 3: הסיפור שלי */}
        <section className="pt-20 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-20 xl:px-32">
          <div className="max-w-5xl mx-auto">
            {/* Content */}
            <motion.div 
              className="space-y-6 text-lg leading-relaxed text-foreground/90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              

              <div className="pt-8 space-y-6">
                <p className="text-2xl font-bold">אני רוצה לשתף איתך תובנה שגיליתי בדרך:</p>

                <p className="text-xl font-semibold">כולנו אמנים - בין אם אנחנו רוצים את זה או לא.</p>

                <p>לא משנה אם אתם עורכי דין, מהנדסים, חשבונאים.<br />
                בעידן החדש הזה, אתם חייבים לחשוב כמו אומנים.</p>

                <p>למה?</p>

                <p>כי הכלים האלה עוזרים לנו ליצור את המציאות שאנחנו רוצים.<br />
                אבל בשביל זה, אתם חייבים:<br />
                לדעת מה אתם רוצים ליצור.<br />
                להסביר את החזון שלכם.<br />
                לבטא את עצמכם בבהירות.</p>

                <p>וזה לא רק בשביל ה-AI - זה בשביל עצמכם.</p>

                <p>הכלים האלה מחזירים לנו מראה.<br />
                הם עוזרים לנו לגלות מי אנחנו באמת.<br />
                מה באמת חשוב לנו.<br />
                מה אנחנו רוצים להשיג.</p>

                <p className="text-xl font-semibold">הם מכריחים אותנו לחשוב כמו יוצרים,<br />
                לא כמו מבצעים.</p>
              </div>

            {/* Header with Photo moved to start of 'מה אני עושה היום' */}
            <motion.div 
              className="flex flex-col items-center gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              dir="rtl"
            >
              <div className="w-56 h-56 rounded-full overflow-hidden shadow-2xl flex-shrink-0">
                <img 
                  src={aviProfile} 
                  alt="אבי פריד"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground">אבי פריד</h2>
            </motion.div>

              <div className="pt-8 space-y-6">
                <p className="text-2xl font-bold">מה אני עושה היום</p>
                <p>אני מעביר הדרכות וסדנאות לקהלים מגוונים. מלמד איך לעבוד עם הכלים בסביבה עסקית ומקצועית. איך להכשיר צוותים לחשוב ביצירתיות בעידן החדש.</p>
                <p>איך לנצל את הטכנולוגיה לא רק כדי לעשות דברים מהר יותר - אלא כדי לחשוב בצורה אחרת לגמרי.</p>
              </div>

              <div className="pt-8 space-y-6">
                <p className="text-2xl font-bold">הרקע שלי</p>
                <p>הניסיון שלי כיזם - פיתוח מיזמים בתחומים שונים, ניהול מערך כוח אדם ברחבי העולם, שותפות בסטארטאפ - נתן לי הבנה עמוקה של האתגרים האמיתיים שעסקים מתמודדים איתם.</p>
                <p>אני לא מדבר מהתיאוריה. אני מדבר מהשטח.</p>
              </div>

              <div className="pt-8 space-y-6">
                <p className="text-2xl font-bold">למה אני כאן</p>
                <p>כי ה-AI הזה? זה הכוח שלך. לא שלי.<br />
                אני כאן להראות לך איך לנצל אותו. איך להפוך משהו שנראה טכני ומפחיד לכלי שמגשים את מה שאתה רוצה ליצור.<br />
                לא להיות תלוי בי. להיות עצמאי.<br />
                להפוך את הטכנולוגיה לשלך.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final Section: אתם האומן + CTA */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-background to-muted/30" />
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-6 lg:px-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Quote mark decoration */}
              <div className="absolute -top-8 right-0 text-8xl font-serif text-primary/10 select-none">״</div>
              
              {/* Main content card */}
              <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-border/50">
                <div className="space-y-6 text-center">
                  {/* Opening statement */}
                  <motion.h3 
                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-l from-primary via-foreground to-primary bg-clip-text text-transparent leading-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    אתם האומן. יש לכם חזון.
                  </motion.h3>
                  
                  <motion.p 
                    className="text-xl lg:text-2xl text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    משהו שאתם רואים, משהו שרק אתם יכולים לראות.
                  </motion.p>
                  
                  {/* Divider */}
                  <div className="flex items-center justify-center gap-3 py-4">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
                  </div>
                  
                  {/* Philosophy core */}
                  <motion.div 
                    className="space-y-4 text-lg lg:text-xl leading-relaxed text-foreground/90 py-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <p className="font-medium">
                      ה-AI הוא הכלי שלכם - המכחול, האזמל, הפטיש.
                    </p>
                    <p className="text-muted-foreground italic">
                      הוא לא יוצר את החזון.
                    </p>
                    <div className="space-y-2 text-foreground font-semibold">
                      <p>אתם רואים את החזון.</p>
                      <p>אתם מחליטים.</p>
                      <p>אתם נותנים את הנשמה.</p>
                    </div>
                  </motion.div>
                  
                  {/* Divider */}
                  <div className="flex items-center justify-center gap-3 py-4">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
                  </div>
                  
                  <motion.p 
                    className="text-xl lg:text-2xl text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    והכלי? הוא מוריד את האבנים הכבדות מהדרך.
                  </motion.p>
                  
                  {/* Closing statement */}
                  <motion.p 
                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent pt-6 leading-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    אין יותר מקום לחלומות קטנים.
                  </motion.p>
                  
                  {/* CTA Button */}
                  <motion.div 
                    className="pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href="/products"
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 text-lg font-semibold shadow-lg"
                    >
                      המסע מתחיל כאן
                    </a>
                  </motion.div>
                </div>
              </div>
              
              {/* Quote mark decoration - closing */}
              <div className="absolute -bottom-8 left-0 text-8xl font-serif text-primary/10 select-none transform rotate-180">״</div>
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