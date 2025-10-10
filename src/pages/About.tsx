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
              לא דרך עוד מידע, פרומפטים מוכנים או טריקים מהירים. אלא דרך בהירות - על מי אתם, מה אתם רוצים ליצור, ואיך הכלים משרתים את המטרות והחזון שלכם.</p>

              <p className="text-2xl font-bold">מה תמצאו כאן?</p>
              <p>להפוך את ה-AI לעוזר האישי שלכם, לשותף לחשיבה וסיעור מוחות.</p>
              <p>בהירות לגבי הכלים הנכונים עבורכם</p>
              <p>להכשיר צוותים לחשוב ביצירתיות בעידן החדש</p>

              <p>זה לא קורס תכנות. זה לא מדריך "לחצו כאן". זה לא פתרון קסם - זאת גישה חדשה.</p>

              <p className="text-2xl font-bold">הבעיה האמיתית</p>
              <p>כולם מדברים על הכלים - איזה גרסה יותר טובה, איזו טכניקה יעילה יותר.<br />
              אף אחד לא מדבר על מה שבאמת חוסם אנשים: הם לא יודעים לתאר מה הם רוצים.<br />
              לא יודעים להגדיר. לא יודעים לנסח את המחשבה. והכלים האלה דורשים בדיוק את זה.</p>

              <p className="text-2xl font-bold">השורה התחתונה</p>
              <p>הטכנולוגיה תמשיך להשתנות. תמיד יהיה כלי חדש.<br />
              אבל אם אנחנו מפתחים גמישות מחשבתית, יצירתיות, ותשתית לחדשנות — אנחנו תמיד נהיה מוכנים לשינויים שיבואו.</p>
              <p>אני לא מלמד AI. אני עוזר לכם להיות בגרסה הכי טובה שלכם בעידן הדיגיטלי החדש.</p>
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
                <p className="text-2xl font-bold">כולנו אמנים - בין אם אנחנו רוצים את זה או לא.</p>

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
                <p>אני מאמין שכוח ה-AI יכול להעצים אתכם.<br />
                אני כאן להראות איך לנצל אותו: איך להפוך משהו שנראה טכני ומפחיד לכלי שמגשים את מה שאתם רוצים ליצור.<br />
                לא להיות תלויים. להיות עצמאיים.<br />
                להפוך את הטכנולוגיה לכלי להתפתחות האישית שלכם.</p>
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