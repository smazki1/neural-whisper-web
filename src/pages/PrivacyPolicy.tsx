import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="bg-brand-primary text-brand-text font-heebo min-h-screen" dir="rtl">
      <Navbar onContactClick={() => {}} />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-brand-surface rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-brand-accent mb-8 text-center">
            מדיניות פרטיות – AI Master
          </h1>
          
          <div className="text-sm text-brand-text/80 mb-8 text-center">
            עודכנה לאחרונה בתאריך: 27 בדצמבר 2024
          </div>

          <div className="space-y-8 text-brand-text leading-relaxed">
            <section>
              <p className="mb-6">
                ברוך הבא לאתר AI Master (להלן: "האתר"), המופעל על ידי פרדיסטור (להלן: "המפעיל"). אנו מכבדים את פרטיות המשתמשים באתר ופועלים בהתאם לחוק הגנת הפרטיות, התשמ"א–1981, חוק התקשורת (בזק ושידורים), התשמ"ב–1982 ("חוק הספאם") והחוקים החלים בישראל.
              </p>
              <p className="mb-6">
                מסמך זה מפרט כיצד אנו אוספים, שומרים, משתמשים ומגנים על המידע האישי של המשתמשים.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                1. איסוף מידע
              </h2>
              <p className="mb-4">במסגרת השימוש באתר, אנו עשויים לאסוף את המידע הבא:</p>
              <ul className="space-y-3 mr-6">
                <li><strong>פרטים הנמסרים על ידך ישירות:</strong> שם מלא, מספר טלפון, כתובת דוא"ל (באמצעות טפסי יצירת קשר או הרשמה לניוזלטר).</li>
                <li><strong>מידע הנמסר בעת רכישת שירותים או מוצרים</strong> – עיבוד התשלומים מתבצע דרך ספקי תשלום חיצוניים (למשל iCount), ואינו נשמר בשרתינו.</li>
                <li><strong>מידע טכני וסטטיסטי על פעילותך באתר:</strong> כתובת IP, סוג דפדפן, עוגיות (Cookies), נתוני גלישה, שימוש ב-Google Analytics וכלי ניטור נוספים.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                2. מטרות השימוש במידע
              </h2>
              <p className="mb-4">המידע שנאסף ישמש אותנו ל:</p>
              <ul className="space-y-3 mr-6">
                <li>מענה לפניותיך ומתן שירות.</li>
                <li>שליחת עדכונים, מבצעים, דיוור שיווקי ותוכן רלוונטי (בכפוף להסכמתך ובהתאם לחוק הספאם).</li>
                <li>שיפור חוויית המשתמש והאתר באמצעות כלי ניתוח נתונים (Google Analytics).</li>
                <li>עמידה בהוראות הדין והרגולציה בישראל.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                3. מסירת מידע לצדדים שלישיים
              </h2>
              <p className="mb-4">אנו לא נעביר את פרטיך האישיים לגורמים אחרים אלא במקרים הבאים:</p>
              <ul className="space-y-3 mr-6">
                <li>ספקי שירות חיצוניים לצורך תפעול האתר (כגון מערכות דיוור, פלטפורמות פרסום כמו פייסבוק וגוגל, ספקי תשלום).</li>
                <li>כאשר חלה עלינו חובה חוקית לעשות כן.</li>
                <li>לשם הגנה על זכויותינו המשפטיות במקרה של מחלוקת.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                4. זכויות המשתמש
              </h2>
              <p className="mb-4">בהתאם לחוק הגנת הפרטיות, עומדות לך הזכויות הבאות:</p>
              <ul className="space-y-3 mr-6">
                <li>בקשה לעיין במידע שנאסף אודותיך.</li>
                <li>בקשה לתקן או למחוק מידע אישי שגוי או שאינך מעוניין שיישמר.</li>
                <li>בקשה להסרה מרשימת דיוור בכל עת (באמצעות קישור "הסרה" או פנייה ישירה אלינו).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                5. אבטחת מידע
              </h2>
              <p className="mb-4">
                אנו מיישמים אמצעי אבטחת מידע סבירים, לרבות שימוש בפרוטוקול SSL (https://), במטרה להגן על פרטיות המידע שנאסף. יחד עם זאת, איננו יכולים להבטיח חסינות מוחלטת מפני חדירה לשרתים או שימוש לא מורשה.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                6. עוגיות (Cookies)
              </h2>
              <p className="mb-4">
                האתר עושה שימוש בעוגיות (Cookies) לצורך תפעול תקין, התאמה אישית של חוויית הגלישה, ניתוח סטטיסטי ושיווק ממוקד.
                באפשרותך לשנות את הגדרות הדפדפן כדי לחסום עוגיות, אולם פעולה זו עלולה לפגוע בחוויית השימוש באתר.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                7. יצירת קשר
              </h2>
              <p className="mb-4">לשאלות, פניות או בקשות הנוגעות למדיניות פרטיות זו ניתן ליצור קשר עם המפעיל:</p>
              <ul className="space-y-3 mr-6">
                <li><strong>דוא"ל:</strong> <a href="mailto:avi@ai-master.co.il" className="text-brand-accent hover:underline">avi@ai-master.co.il</a></li>
                <li><strong>טלפון:</strong> <a href="tel:0527772807" className="text-brand-accent hover:underline">052-7772807</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                8. שינויים במדיניות
              </h2>
              <p className="mb-4">
                המפעיל רשאי לעדכן מדיניות זו מעת לעת. הגרסה העדכנית ביותר תפורסם באתר ותיכנס לתוקף במועד פרסומה.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;