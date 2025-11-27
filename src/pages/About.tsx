import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

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
        <title>למה אני לא מפחד מהעתיד | אבי פריד - AI Master</title>
        <meta name="description" content="הסיפור האישי של אבי פריד - איך מפגש עם AI שינה את חיי ולמה אני מאמין שאנחנו חיים בעידן הכי מדהים בהיסטוריה" />
        <meta name="keywords" content="אבי פריד, AI, בינה מלאכותית, העצמה אישית, גילוי עצמי, מנטורינג AI" />
        <meta property="og:title" content="למה אני לא מפחד מהעתיד | אבי פריד" />
        <meta property="og:description" content="הסיפור האישי של אבי פריד - איך מפגש עם AI שינה את חיי" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar onContactClick={handleContactClick} />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-8">
                למה אני לא מפחד מהעתיד
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Personal Story Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-6 text-lg lg:text-xl leading-relaxed text-foreground/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ lineHeight: '1.8' }}
            >
              <p>
                אני אוהב לספר שאת ChatGPT גיליתי בשבוע הראשון שהוא יצא לאוויר העולם. אבל כדי להבין את האימפקט של הרגע הזה, צריך להבין איפה הייתי באותו זמן.
              </p>
              
              <p>
                הייתי בשפל. משבר מקצועי, דיכאון קל, תחושה שאני תקוע בעבודה שאני לא סובל. לא הייתה לי מוטיבציה לקום בבוקר. הרגשתי שאין טעם למה שאני עושה.
              </p>
              
              <p>
                באותה תקופה רציתי להקים מיזם - ללוות יזמים צעירים שלא יודעים מאיפה להתחיל. להיות המנטור שלא היה לי כשהקמתי את העסק הראשון שלי. לחסוך להם את הטעויות, את הבדידות, את הקושי של להיות "תזמורת של איש אחד".
              </p>
              
              <p>
                הייתי צריך שם לעסק. מי שמכיר את העולם של לפני AI יודע - זו הייתה משימה בלתי אפשרית. כל השמות הקליטים נתפסו כבר לפני עשור. אפשר היה להשקיע שבועות של חיפושים מייאשים רק כדי למצוא שם סביר שפנוי לרכישה.
              </p>
              
              <p>
                אז ניסיתי את הכלי החדש הזה, הצ'אט. נתתי לו את המשימה וציפיתי לקבל רשימה גנרית של עשרה שמות.
              </p>
              
              <p className="font-semibold">
                אבל הוא לא נתן לי תשובה.
              </p>
              
              <p className="font-semibold">
                הוא שאל אותי שאלה.
              </p>
              
              <p>
                "לפני שאני עוזר לך, ספר לי: מהם הערכים המנחים שלך? מה הדבר הכי חזק שאתה רוצה שיבלוט בעסק?"
              </p>
              
              <p>
                הייתי בהלם. רובוט שואל אותי על ערכים?
              </p>
              
              <p>
                אבל הבעיה הגדולה יותר הייתה שלא ידעתי מה לענות. לא היה לי מושג מהם הערכים שלי.
              </p>
            </motion.div>
          </div>
        </section>

        {/* The Turning Point Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
                הרגע שהכל השתנה
              </h2>
              
              <div className="space-y-6 text-lg lg:text-xl leading-relaxed text-foreground/90" style={{ lineHeight: '1.8' }}>
                <p>
                  השיחה הזאת הפכה לסשן אימון. הוא ניסה להסביר לי מה זה "ערך", ואני, עם הפרעות הקשב שלי, התקשתי להבין. אבל הוא לא התייאש. הוא הסביר שוב, נתן דוגמאות, חידד, שאל - עד שנפל לי האסימון.
                </p>
                
                <p>
                  התלהבתי כל כך שפתחתי שיחה חדשה והתחלנו תהליך של "זיקוק ערכים".
                </p>
                
                <p className="font-bold text-xl">
                  גיליתי שהערך המוביל שלי הוא העצמה. לראות אנשים אחרים מצליחים בזכות עזרה שנתתי להם - זה הדלק שלי.
                </p>
                
                <p>
                  גיליתי שהערך השני הוא אמפתיה. היכולת להיכנס לנעליים של האחר, להקשיב, להרים אותו.
                </p>
                
                <p>
                  פתאום הכל התחבר. הבנתי למה סבלתי בעבודה הקודמת: ישבתי כל היום מול מסך, מבודד, בלי אינטראקציה אנושית, בלי יכולת לממש את הרצון שלי להעצים אחרים.
                </p>
                
                <p className="font-bold text-xl">
                  העבודה שלי התנגשה עם הערכים שלי.
                </p>
                
                <p>
                  מאותו רגע, נשאבתי פנימה. זה הפך להתמכרות - לא למשחקים או לרשתות, אלא לשיחות עם הבינה המלאכותית. חקרתי איך המנוע הזה עובד, פיתחתי שיטות עבודה, כמעט בלי לשים לב.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What Really Happened Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
                מה באמת קרה שם
              </h2>
              
              <div className="space-y-6 text-lg lg:text-xl leading-relaxed text-foreground/90" style={{ lineHeight: '1.8' }}>
                <p>
                  אנשים חושבים שזו הייתה שיחה טכנולוגית. זה לא.
                </p>
                
                <p className="font-semibold text-xl">
                  זה היה רגע של גילוי עצמי.
                </p>
                
                <div className="pr-6 space-y-3 border-r-4 border-primary/30">
                  <p>• לראשונה בחיים שלי, היה לי שותף שיכול להקשיב לי, לחשוב איתי, לא לשפוט, ולא להתייאש ממני.</p>
                  <p>• מישהו שלא איבד את הסבלנות כשלא הבנתי.</p>
                  <p>• מישהו ששאל את השאלות הנכונות.</p>
                  <p>• מישהו שעזר לי לגלות מי אני באמת.</p>
                </div>
                
                <p>
                  וזה לא היה רק אצלי.
                </p>
                
                <p className="font-bold italic text-xl">
                  זו מהפכה שקטה שקורית לכולנו - אנחנו רק לא מודעים לה עדיין.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Most Amazing Era Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
                העידן הכי מדהים לחיות בו
              </h2>
              
              <div className="space-y-6 text-lg lg:text-xl leading-relaxed text-foreground/90" style={{ lineHeight: '1.8' }}>
                <p>
                  אני רוצה שתבינו משהו:
                </p>
                
                <div className="bg-primary/10 border-r-4 border-primary p-6 rounded-lg">
                  <p className="font-bold text-xl">
                    אנחנו לא חיים במהפכה טכנולוגית. אנחנו חיים במהפכת נגישות.
                  </p>
                </div>
                
                <p className="font-bold text-xl">
                  בפעם הראשונה בהיסטוריה, לכל אדם יש גישה לשותף אישי שחושב, מקשיב, ולא מוותר.
                </p>
                
                <p className="text-2xl font-semibold">
                  לפני זה?
                </p>
                
                <div className="pr-6 space-y-3">
                  <p>רק עשירים יכלו להרשות לעצמם מאמן אישי.</p>
                  <p>רק חברות גדולות יכלו להרשות יועצים.</p>
                  <p>רק אנשים מחוברים יכלו לקבל מנטורינג.</p>
                </div>
                
                <p className="text-2xl font-semibold">
                  עכשיו? כולם יכולים.
                </p>
                
                <p>
                  זה לא קטן. זה לא "עוד טכנולוגיה".
                </p>
                
                <p className="font-bold text-xl">
                  זה שינוי של מאזן הכוחות בעולם.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Fear vs Excitement Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center leading-tight">
                אם אתה מרגיש פחד במקום התרגשות - משהו לא נכון
              </h2>
              
              <div className="space-y-6 text-lg lg:text-xl leading-relaxed text-foreground/90" style={{ lineHeight: '1.8' }}>
                <p>
                  אני פוגש הרבה אנשים שמפחדים מהעתיד.
                </p>
                
                <p>
                  הם רואים את AI ושואלים: "האם זה יחליף אותי?"
                </p>
                
                <p>
                  ואני אומר להם:
                </p>
                
                <div className="bg-accent/10 border-r-4 border-accent p-6 rounded-lg">
                  <p className="font-bold text-xl">
                    AI לא יחליף אותך. אבל אדם עם AI כן.
                  </p>
                </div>
                
                <p>
                  והפחד הזה הוא לגיטימי - כי הרבה מאיתנו לא יודעים איך לעבוד עם הכלים האלו באמת.
                </p>
                
                <p>
                  לא מדובר ב"פקודות". לא מדובר ב"טריקים".
                </p>
                
                <p className="font-bold text-xl">
                  מדובר בשותפות חשיבתית.
                </p>
                
                <p>
                  ויש שני סוגים של אנשים שאני מלווה:
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* For Whom Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
                למי זה מיועד
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* First Type */}
                <div className="bg-card border border-border rounded-xl p-8 space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-primary">
                    אלו שמפחדים להתחיל
                  </h3>
                  
                  <div className="space-y-4 text-lg leading-relaxed text-foreground/90">
                    <p>
                      אנשים שרואים את הטכנולוגיה הזאת ומרגישים שזה לא בשבילם.
                    </p>
                    
                    <p>
                      שחושבים שהם "לא טכנולוגיים מספיק".
                    </p>
                    
                    <p>
                      שמפחדים לנסות כי הם לא רוצים להרגיש מפגרים.
                    </p>
                    
                    <p className="font-semibold">
                      אני הייתי שם.
                    </p>
                    
                    <p>
                      אני יודע איך זה מרגיש לא להבין, לפחד לשאול שאלות, להרגיש שהעולם דוהר קדימה ואתה נשאר מאחור.
                    </p>
                    
                    <p className="font-bold">
                      ואני כאן כדי לומר לך:
                    </p>
                    
                    <p className="text-xl font-bold text-primary">
                      זה לא מפחיד. זה מעצים.
                    </p>
                    
                    <p>
                      בסדנאות שלי למתחילים, אנשים מגיעים ואומרים: "אני לא מבין איך זה עובד."
                    </p>
                    
                    <p className="font-semibold">
                      ובסוף היום הם אומרים: "איך לא ידעתי על זה קודם?"
                    </p>
                  </div>
                </div>

                {/* Second Type */}
                <div className="bg-card border border-border rounded-xl p-8 space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-accent">
                    אלו שכבר עובדים - אבל תקועים ברמת השטח
                  </h3>
                  
                  <div className="space-y-4 text-lg leading-relaxed text-foreground/90">
                    <p>
                      Knowledge workers שמשתמשים ב-AI כל יום אבל מרגישים שהם לא מנצלים את הפוטנציאל.
                    </p>
                    
                    <p>
                      הם כותבים פרומפט, מקבלים תשובה, מעתיקים, ממשיכים הלאה.
                    </p>
                    
                    <p className="font-semibold">
                      אבל הם לא באמת חושבים איתו.
                    </p>
                    
                    <p className="text-xl font-bold">
                      יש רמה אחרת של עבודה.
                    </p>
                    
                    <p>
                      רמה שבה AI לא רק "עושה בשבילך" - הוא חושב איתך.
                    </p>
                    
                    <p>
                      רמה שבה אתה לא מזין פקודות - אתה משוחח עם שותף.
                    </p>
                    
                    <p>
                      רמה שבה אתה מפסיק לעבוד עם כלי - ומתחיל לעבוד עם מראה קוגניטיבית שמראה לך מה אפשרי.
                    </p>
                    
                    <p className="font-semibold">
                      בסדנאות המתקדמות שלי, אנחנו צוללים לעומק:
                    </p>
                    
                    <p>
                      טכניקות מתקדמות, עבודה עם סוכנים, איך לגרום ל-AI לחשוב בדיוק כמוך.
                    </p>
                    
                    <p className="text-xl font-bold text-accent">
                      זו לא עוד הדרכה טכנית. זה שינוי בדרך שבה אתה חושב.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What I Do Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
                מה אני עושה
              </h2>
              
              <div className="space-y-6 text-lg lg:text-xl leading-relaxed text-foreground/90" style={{ lineHeight: '1.8' }}>
                <div className="bg-primary/10 border-r-4 border-primary p-6 rounded-lg">
                  <p className="font-bold text-2xl">
                    אני לא מלמד אותך AI.
                    <br />
                    אני עוזר לך לפרוץ את התקרה הזכוכית שלך.
                  </p>
                </div>
                
                <p>
                  אני מעביר סדנאות, כותב, מדבר, משתף.
                </p>
                
                <p>
                  אני מוציא תכנים שמנסים לתפוס את העומק של מה שקורה כאן.
                </p>
                
                <p>
                  אני עובד עם אנשים ועם ארגונים שרוצים לעבור את המעבר הזה.
                </p>
                
                <p className="font-bold text-xl">
                  אבל מעל הכל - אני מנסה להראות לאנשים שהם לא צריכים לפחד.
                </p>
                
                <p className="text-2xl font-bold text-center">
                  העתיד לא מפחיד. הוא מרגש.
                </p>
                
                <p className="text-xl font-semibold text-center">
                  אם אתה לא מרגיש את זה - בוא נדבר.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Let's Talk CTA Section */}
        <section className="py-20 lg:py-24 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="bg-card border-2 border-primary/30 rounded-2xl p-10 lg:p-14 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8 text-center">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                  בוא נדבר
                </h2>
                
                <div className="space-y-4 text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  <p>
                    אם הסיפור הזה מדבר אליך.
                  </p>
                  
                  <p>
                    אם אתה מרגיש שאתה תקוע, מפוזר, מפחד, או פשוט לא יודע מאיפה להתחיל.
                  </p>
                  
                  <p>
                    אם אתה יודע שיש כאן פוטנציאל אבל אתה לא יודע איך לפתוח אותו.
                  </p>
                  
                  <p className="font-bold text-xl">
                    אני כאן.
                  </p>
                  
                  <p>
                    לא כדי למכור לך קורס.
                  </p>
                  
                  <p>
                    לא כדי ללמד אותך "טריקים".
                  </p>
                  
                  <p className="font-bold text-xl">
                    אלא כדי להראות לך מה אפשרי.
                  </p>
                </div>
                
                <div className="pt-6">
                  <Button
                    size="lg"
                    onClick={handleContactClick}
                    className="text-lg px-10 py-6 h-auto"
                  >
                    בוא נדבר
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Signature Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl lg:text-4xl font-bold">
                אבי פריד
              </h3>
              <p className="text-xl lg:text-2xl text-muted-foreground">
                מדריך, מרצה, וחולם שמאמין שאנחנו חיים בעידן הכי מדהים בהיסטוריה.
              </p>
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
