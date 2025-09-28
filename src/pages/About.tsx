import { motion } from "framer-motion";
import aviPhoto from "@/assets/avi-fried-photo.jpg";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>אודות | loveabel.dev</title>
        <meta name="description" content="הכירו את האדם מאחורי הקוד - הסיפור האישי, הגישה וההשקפה על פיתוח ועיצוב דיגיטלי" />
        <meta name="keywords" content="אודות, פיתוח אתרים, עיצוב דיגיטלי, loveabel.dev" />
        <meta property="og:title" content="אודות | loveabel.dev" />
        <meta property="og:description" content="הכירו את האדם מאחורי הקוד" />
        <meta property="og:image" content={aviPhoto} />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Left Side - Text Content */}
            <motion.div 
              className="lg:col-span-7 space-y-8 text-right"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8 text-lg leading-relaxed text-foreground">
                <p>
                  שלום, אני מפתח אתרים ויוצר חוויות דיגיטליות. אבל לפני שנכנס לפרטים הטכניים, רציתי לספר לכם קצת על עצמי ועל הדרך שהובילה אותי עד לכאן.
                </p>
                
                <p>
                  ההתחלה שלי בעולם הפיתוח לא הייתה מתוכננת. זה קרה כמעט במקרה, כשניסיתי לבנות אתר פשוט לחבר. מה שהתחיל כפרויקט של סוף השבוע הפך לתשוקה אמיתית כשגיליתי את הכוח הטמון ביצירת דברים דיגיטליים שאנשים באמת יכולים להשתמש בהם.
                </p>

                <p>
                  היום, אחרי שנים של עבודה עם לקוחות מכל הסוגים - מחברות סטארט-אפ קטנות ועד עסקים מבוססים - אני מבין שהטכנולוגיה היא רק כלי. מה שבאמת חשוב זה האנשים שעומדים מאחורי כל פרויקט והסיפור שהם רוצים לספר.
                </p>

                <p>
                  הגישה שלי פשוטה: כל אתר צריך להיות לא רק יפה ופונקציונלי, אלא גם לשקף באמת את האישיות והערכים של מי שעומד מאחוריו. אני לא מאמין ב"תבניות" או בפתרונות גנריים. כל לקוח הוא עולם בפני עצמו, עם צרכים ייחודיים וחזון מיוחד.
                </p>

                <p>
                  במהלך השנים למדתי שהחלק הכי חשוב בעבודתי הוא ההקשבה. לפני שאני כותב שורת קוד אחת, אני צריך להבין מי הקהל יעד, מה המטרות העסקיות, ואיך האתר יכול לעזור להשיג אותן. זה לא רק עניין של עיצוב טוב או קוד נקי - זה עניין של יצירת חוויה שבאמת משרתת את המטרה.
                </p>

                <p>
                  אני מתמחה בפיתוח אתרים מותאמים אישית עם דגש מיוחד על ביצועים, נגישות וחוויית משתמש. אני עובד עם טכנולוגיות מתקדמות כמו React ו-Next.js, אבל תמיד שם את הפשטות והמהירות במקום הראשון.
                </p>

                <p>
                  מה שמניע אותי כל יום זה לראות איך הפרויקטים שאני בונה באמת עוזרים לאנשים להשיג את המטרות שלהם. לראות אתר שפיתחתי מביא לקוחות חדשים לעסק קטן, או מאפשר לארגון ללא כוונת רווח להגיע ליותר אנשים שצריכים את השירותים שלהם.
                </p>

                <p>
                  אם אתם מחפשים מישהו שיקשיב, יבין את החזון שלכם ויעזור לכם להביא אותו לחיים דיגיטליים - אשמח לשמוע מכם. בואו ניצור משהו מיוחד ביחד.
                </p>
              </div>
            </motion.div>

            {/* Right Side - Title and Photo */}
            <motion.div 
              className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-12"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Large Title */}
              <div className="text-center lg:text-left">
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-foreground">
                  אודות
                </h1>
              </div>

              {/* Photo */}
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl">
                  <img 
                    src={aviPhoto} 
                    alt="תמונה אישית"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;