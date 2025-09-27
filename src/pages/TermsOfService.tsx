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
            עודכן לאחרונה בתאריך: 27 בדצמבר 2024
          </div>

          <div className="space-y-8 text-brand-text leading-relaxed">
            <section>
              <p className="mb-6">
                ברוך הבא לאתר AI Master (להלן: "האתר"), המופעל על ידי פרדיסטור (להלן: "המפעיל"). שימוש באתר ובשירותיו מהווה הסכמה לתנאים המפורטים להלן. אנא קרא בעיון את התקנון לפני השימוש באתר.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                1. כללי
              </h2>
              <ul className="space-y-3 mr-6">
                <li>השימוש באתר כפוף לתנאי התקנון ולעדכוניו מעת לעת.</li>
                <li>המפעיל רשאי לשנות את תנאי התקנון בכל עת, והנוסח העדכני יחייב את המשתמשים ממועד פרסומו.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                2. שימוש באתר
              </h2>
              <ul className="space-y-3 mr-6">
                <li>האתר נועד לספק מידע, תכנים ושירותים בתחום הבינה המלאכותית, לרבות קורסים, סדנאות, ייעוץ ומוצרים דיגיטליים.</li>
                <li>חל איסור להשתמש באתר לכל מטרה בלתי חוקית, מסחרית או אחרת הסותרת את תנאי התקנון.</li>
                <li>המשתמש מתחייב שלא להעלות או לשדר תוכן פוגעני, מטעה, מאיים, מסית או מפר זכויות יוצרים.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                3. רישום ורכישות
              </h2>
              <ul className="space-y-3 mr-6">
                <li>חלק מהשירותים באתר מחייבים הרשמה או תשלום. המשתמש מתחייב למסור פרטים נכונים, מלאים ומעודכנים.</li>
                <li>התשלומים באתר מתבצעים באמצעות ספקי תשלום חיצוניים (כגון iCount). המפעיל אינו שומר פרטי אשראי ואינו נושא באחריות לתקלות הקשורות לגורמים אלו.</li>
                <li>ביטול עסקה יתבצע בהתאם למדיניות הביטולים וההחזרים המפורסמת באתר ובהתאם לחוק הגנת הצרכן.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                4. זכויות יוצרים וקניין רוחני
              </h2>
              <ul className="space-y-3 mr-6">
                <li>כל זכויות היוצרים, סימני המסחר, התכנים, העיצובים, הקבצים, הקורסים והחומרים המופיעים באתר הינם רכושו הבלעדי של המפעיל או של צדדים שלישיים שהסמיכו אותו.</li>
                <li>אין להעתיק, לשכפל, להפיץ, לפרסם, לשדר או למסחר כל תוכן מהאתר ללא אישור מראש ובכתב מהמפעיל.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                5. אחריות והגבלת אחריות
              </h2>
              <ul className="space-y-3 mr-6">
                <li>המפעיל עושה מאמצים לשמור על תקינות האתר, אך אינו מתחייב כי האתר יהיה חף מתקלות, טעויות או הפרעות.</li>
                <li>השימוש באתר נעשה על אחריות המשתמש בלבד. המפעיל לא יישא בכל אחריות לנזקים ישירים או עקיפים שייגרמו עקב שימוש באתר.</li>
                <li>המידע באתר ניתן "כפי שהוא" (AS IS) ואין לראות בו ייעוץ מקצועי מחייב.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                6. פרטיות
              </h2>
              <ul className="space-y-3 mr-6">
                <li>השימוש באתר כפוף גם למדיניות הפרטיות של המפעיל.</li>
                <li>המשתמש מסכים לאיסוף ושימוש במידע בהתאם למדיניות הפרטיות.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                7. דין וסמכות שיפוט
              </h2>
              <ul className="space-y-3 mr-6">
                <li>על תקנון זה יחולו אך ורק דיני מדינת ישראל.</li>
                <li>סמכות השיפוט הבלעדית בכל עניין הנוגע לתקנון זה ולשימוש באתר נתונה לבתי המשפט המוסמכים במחוז תל אביב–יפו.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                8. יצירת קשר
              </h2>
              <p className="mb-4">לשאלות ובירורים ניתן לפנות ל:</p>
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