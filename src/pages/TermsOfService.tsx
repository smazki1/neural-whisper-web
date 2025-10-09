import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="bg-brand-primary text-brand-text font-heebo min-h-screen" dir="rtl">
      <Navbar onContactClick={() => {}} />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-brand-surface rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-brand-accent mb-8 text-center">
            תקנון שימוש – AI Master
          </h1>
          
          <div className="text-sm text-brand-text/80 mb-8 text-center">
            עודכן לאחרונה בתאריך: 10 באוקטובר 2025
          </div>

          <div className="space-y-8 text-brand-text leading-relaxed">
            <section>
              <p className="mb-6">
                ברוך הבא לאתר AI Master (להלן: "האתר"), המופעל על ידי פרדיסטור (להלן: "המפעיל").
                השימוש באתר ובשירותיו מהווה הסכמה מלאה ומחייבת לתנאים המפורטים להלן. אנא קרא בעיון את התקנון לפני השימוש באתר.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">1. כללי</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>השימוש באתר כפוף לתנאי התקנון ולעדכוניו מעת לעת.</li>
                <li>המפעיל רשאי לשנות את תנאי התקנון בכל עת, והנוסח המעודכן יפורסם באתר ויחייב את המשתמשים ממועד פרסומו.</li>
                <li>שימוש באתר לאחר עדכון התקנון מהווה הסכמה מחודשת לתנאיו.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">2. שימוש באתר</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>האתר נועד לספק מידע, תכנים, קורסים, סדנאות, ייעוץ ומוצרים דיגיטליים בתחום הבינה המלאכותית.</li>
                <li>חל איסור להשתמש באתר לכל מטרה בלתי חוקית, מסחרית ללא הרשאה, או אחרת הסותרת את תנאי התקנון.</li>
                <li>המשתמש מתחייב שלא להעלות, לשדר או להפיץ באתר:
                  <ul className="space-y-2 mr-6 list-disc">
                    <li>תוכן פוגעני, שקרי, מטעה, מסית, מאיים או מטריד.</li>
                    <li>תוכן המפר זכויות יוצרים, סימני מסחר או כל זכות אחרת של צד שלישי.</li>
                    <li>קוד זדוני, וירוסים או כל רכיב שעלול לפגוע בתפקוד האתר.</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">3. רישום ורכישות</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>חלק מהשירותים באתר מחייבים הרשמה או תשלום. המשתמש מתחייב למסור פרטים נכונים, מלאים ומעודכנים.</li>
                <li>תשלומים באתר מבוצעים באמצעות ספקי תשלום חיצוניים (כגון iCount, PayMe). המפעיל אינו שומר פרטי אשראי ואינו נושא באחריות לתקלות או שיבושים הקשורים לספקים אלו.</li>
                <li>ביטול עסקה יתבצע בהתאם למדיניות הביטולים וההחזרים המפורסמת באתר ובהתאם להוראות חוק הגנת הצרכן, התשמ"א–1981.</li>
                <li>המפעיל שומר לעצמו את הזכות לבטל עסקה או לחסום משתמש במקרה של חשד לשימוש לרעה או פעולה בלתי חוקית.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">4. זכויות יוצרים וקניין רוחני</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>כל זכויות היוצרים, סימני המסחר, התכנים, הקורסים, החומרים, הקבצים, העיצובים והתוכנות באתר – הינם רכושו הבלעדי של המפעיל או של צדדים שלישיים שהסמיכו אותו לכך.</li>
                <li>אין להעתיק, לשכפל, להפיץ, לפרסם, למסחר, לשדר או לעשות כל שימוש בתכני האתר ללא אישור מפורש מראש ובכתב מהמפעיל.</li>
                <li>הפרת זכויות יוצרים או שימוש לא מורשה עלולים לגרור נקיטת צעדים משפטיים.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">5. אחריות והגבלת אחריות</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>המפעיל עושה מאמצים לשמור על תקינות וזמינות האתר, אולם אינו מתחייב שהשירות יהיה חף מתקלות, טעויות או הפרעות.</li>
                <li>השימוש באתר נעשה על אחריות המשתמש בלבד.</li>
                <li>המפעיל לא יישא בכל אחריות לנזקים ישירים, עקיפים, כספיים או תוצאתיים שייגרמו עקב שימוש באתר או הסתמכות על המידע בו.</li>
                <li>כל המידע באתר ניתן "כפי שהוא" (AS IS), ואין לראות בו ייעוץ מקצועי, פיננסי, טכנולוגי או משפטי מחייב.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">6. פרטיות</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>השימוש באתר כפוף גם למדיניות הפרטיות של המפעיל, המהווה חלק בלתי נפרד מתקנון זה.</li>
                <li>המשתמש מסכים לאיסוף, שימוש, עיבוד ושמירת המידע האישי בהתאם למדיניות הפרטיות ולעקרונות חוק הגנת הפרטיות (תיקון 13, 2025).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">7. דין וסמכות שיפוט</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>על תקנון זה יחולו אך ורק דיני מדינת ישראל.</li>
                <li>סמכות השיפוט הבלעדית בכל עניין הנוגע לתקנון זה ולשימוש באתר נתונה לבתי המשפט המוסמכים במחוז תל־אביב–יפו.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">8. יצירת קשר</h2>
              <p className="mb-4">לשאלות, פניות או בקשות ניתן ליצור קשר עם המפעיל:</p>
              <ul className="space-y-3 mr-6">
                <li><strong>דוא"ל:</strong> <a href="mailto:avi@ai-master.co.il" className="text-brand-accent hover:underline">avi@ai-master.co.il</a></li>
                <li><strong>טלפון:</strong> <a href="tel:0527772807" className="text-brand-accent hover:underline">052-7772807</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;