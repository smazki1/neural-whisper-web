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
            מדיניות פרטיות – אתר AI Master
          </h1>
          
          <div className="text-sm text-brand-text/80 mb-8 text-center">
            עודכן לאחרונה: 3 באוגוסט 2025
          </div>

          <div className="space-y-8 text-brand-text leading-relaxed">
            <section>
              <p className="mb-6">
                ברוכים הבאים לאתר AI Master (להלן: "האתר"). האתר מופעל ומנוהל על-ידי AI Master (להלן: "הבעלים"/"המפעיל").
              </p>
              <p className="mb-6">
                שמירה על פרטיות המשתמשים הינה ערך מרכזי בפעילות האתר, והאתר מתחייב לעמוד בדרישות חוק הגנת הפרטיות, תשמ"א–1981, תקנות הגנת הפרטיות (אבטחת מידע), תשע"ז–2017, ותיקון 13 לחוק.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                1. איזה מידע נאסף באתר?
              </h2>
              <ul className="space-y-3 mr-6">
                <li><strong>פרטי יצירת קשר:</strong> שם מלא, כתובת דוא"ל, טלפון, וכל פרט נוסף שתבחר למסור בטפסי יצירת הקשר.</li>
                <li><strong>פרטי רכישה:</strong> פרטי הזמנה, פרטי התקשרות, ונתוני אמצעי תשלום (המעובדים ישירות על-ידי ספק סליקה מאובטח, ואינם נשמרים באתר).</li>
                <li><strong>פרטי הרשמה לרשימת דיוור:</strong> שם ודוא"ל.</li>
                <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה, עוגיות ("Cookies"), פרטי גלישה ושימוש באתר.</li>
                <li><strong>נתונים הנמסרים או נאספים דרך אינטגרציה עם רשתות חברתיות.</strong></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                2. מטרות השימוש במידע
              </h2>
              <ul className="space-y-3 mr-6">
                <li>מתן שירותי האתר, טיפול בפניות, ניהול וביצוע רכישות.</li>
                <li>משלוח עדכונים, הצעות שיווקיות, דיוור ישיר ומידע מקצועי (בכפוף להסכמת המשתמש).</li>
                <li>שיפור חוויית המשתמש, ניתוח סטטיסטי, ואבטחת המידע.</li>
                <li>עמידה בדרישות כל דין.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                3. מסירת מידע לצדדים שלישיים
              </h2>
              <ul className="space-y-3 mr-6">
                <li>מידע אישי מועבר לצדדים שלישיים רק לצורך מתן השירותים (כגון: ספקי סליקה, חברת דיוור, חברות אחסון/אבטחה) – כולם מחויבים לעמוד בדרישות החוק והתקנות.</li>
                <li>לא יימסר מידע לצדדים שלישיים למטרות שיווק/פרסום ללא הסכמה מפורשת.</li>
                <li>המידע אינו מועבר לצדדים מחוץ לישראל אלא בהתאם להוראות החוק (רק למדינות עם הגנה הולמת או בכפוף להסכמה).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                4. אבטחת מידע
              </h2>
              <ul className="space-y-3 mr-6">
                <li>האתר נוקט באמצעי אבטחה מתקדמים, לרבות הצפנת מידע (SSL), גיבויים תקופתיים, ניהול הרשאות ובקרות גישה.</li>
                <li>למרות המאמצים, אין אפשרות להבטיח אבטחה מוחלטת של המידע.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                5. עוגיות ("Cookies")
              </h2>
              <ul className="space-y-3 mr-6">
                <li>האתר עושה שימוש בקבצי עוגיות לאיסוף נתונים סטטיסטיים, התאמה אישית של חוויית המשתמש, ולשיפור השירות.</li>
                <li>המשתמש יכול לבחור לחסום/למחוק עוגיות דרך הגדרות הדפדפן, אך ייתכן שחלק מהשירותים לא יהיו זמינים.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                6. דיוור ישיר ועדכון משתמשים
              </h2>
              <ul className="space-y-3 mr-6">
                <li>שליחת הודעות דיוור ישיר/שיווקי תתבצע רק לאחר קבלת הסכמת המשתמש (opt-in).</li>
                <li>ניתן לבטל הרשמה ("הסרה מרשימה") בלחיצה אחת בכל דוא"ל שיווקי, או באמצעות פנייה ישירה.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                7. זכויות המשתמש
              </h2>
              <ul className="space-y-3 mr-6">
                <li>כל משתמש זכאי לעיין, לתקן, לעדכן או לבקש מחיקת המידע שמוחזק אודותיו – על-פי הוראות חוק הגנת הפרטיות.</li>
                <li>בקשות בעניין זה יש להפנות לדוא"ל: <a href="mailto:avi@ai-master.co.il" className="text-brand-accent hover:underline">avi@ai-master.co.il</a> או באמצעות טופס יצירת קשר באתר.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                8. שמירת מידע והעברה לחו"ל
              </h2>
              <ul className="space-y-3 mr-6">
                <li>הנתונים נשמרים בשרתים מאובטחים בישראל או במדינות בעלות הגנת מידע הולמת בלבד.</li>
                <li>העברת מידע מחוץ לישראל תיעשה רק בהתאם לחוק, ובכפוף להסכמת המשתמש או קיומן של הבטחות הגנה נדרשות.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                9. שינויים במדיניות הפרטיות
              </h2>
              <ul className="space-y-3 mr-6">
                <li>האתר רשאי לעדכן מדיניות זו מעת לעת. עדכון מהותי יפורסם ויובלט בעמוד הראשי של האתר.</li>
                <li>תאריך העדכון האחרון מופיע בראש המסמך.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                10. יצירת קשר
              </h2>
              <p className="mb-4">
                לשאלות, בקשות, או הערות בעניין פרטיות ואבטחת מידע – ניתן ליצור קשר:
              </p>
              <ul className="space-y-3 mr-6">
                <li><strong>דוא"ל:</strong> <a href="mailto:avi@ai-master.co.il" className="text-brand-accent hover:underline">avi@ai-master.co.il</a></li>
                <li><strong>טלפון:</strong> <a href="tel:0527772807" className="text-brand-accent hover:underline">0527772807</a></li>
                <li><strong>טופס יצירת קשר באתר</strong></li>
              </ul>
            </section>

            <section className="bg-brand-accent/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">
                אישור המשתמש
              </h2>
              <p>
                בשימוש באתר, הנך מאשר כי קראת והבנת את מדיניות הפרטיות ואתה מסכים לתנאיה.
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