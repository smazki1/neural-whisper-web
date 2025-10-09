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
            תקנון שימוש ומדיניות פרטיות – AI Master
          </h1>
          
          <div className="text-sm text-brand-text/80 mb-8 text-center">
            עודכן לאחרונה בתאריך: 10 באוקטובר 2025
          </div>

          <div className="space-y-8 text-brand-text leading-relaxed">
            <section>
              <p className="mb-6">
                ברוך הבא לאתר AI Master (להלן: "האתר"), המופעל על ידי פרדיסטור (להלן: "המפעיל").
                השימוש באתר ובשירותיו מהווה הסכמה מלאה לתנאים ולמדיניות הפרטיות שלהלן. אם אינך מסכים – אנא הימנע משימוש באתר.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">1. הגדרות</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li><strong>מידע אישי</strong> – כל נתון הנוגע לאדם מזוהה או שניתן לזהותו במאמץ סביר, לרבות כתובות IP, מזהים טכנולוגיים וכדומה.</li>
                <li><strong>בעל שליטה במאגר</strong> – המפעיל, הקובע את מטרות עיבוד המידע.</li>
                <li><strong>מחזיק מידע</strong> – כל גורם המעבד מידע בשם המפעיל (כגון ספקי שירותי ענן ותשלומים).</li>
                <li><strong>עיבוד מידע</strong> – כל פעולה במידע אישי: איסוף, אחסון, שימוש, ניתוח, שיתוף, מחיקה ועוד.</li>
                <li><strong>נושא המידע</strong> – המשתמש באתר או כל אדם שהמידע עליו נאסף.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">2. תחולה ושינויים</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>השימוש באתר כפוף לתקנון זה ולעדכוניו.</li>
                <li>המפעיל רשאי לשנות את התקנון ומדיניות הפרטיות בכל עת, והנוסח המעודכן יפורסם באתר ויחייב ממועד פרסומו.</li>
                <li>במקרה שסעיף מסוים יימצא בלתי חוקי או בטל – יתר הסעיפים יישארו בתוקף.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2ל font-semibold text-brand-accent mb-4">3. שימוש באתר</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>האתר נועד לספק תכנים, קורסים, סדנאות, ייעוץ ומוצרים דיגיטליים בתחום הבינה המלאכותית.</li>
                <li>חל איסור להשתמש באתר לכל מטרה בלתי חוקית, פוגענית, מסחרית ללא הרשאה או הסותרת את תנאי התקנון.</li>
                <li>המשתמש מתחייב לא להעלות או לשדר תוכן פוגעני, מאיים, מסית, שקרי, מטעה או מפר זכויות יוצרים.</li>
                <li>המשתמש מתחייב לא לבצע חדירה למערכות, לא לשתול קוד זדוני ולא לפגוע בתפקוד האתר.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">4. הרשמה, תשלומים וביטולים</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>חלק מהשירותים באתר מחייבים הרשמה ומסירת פרטים מזהים. המשתמש מתחייב למסור מידע נכון, שלם ומעודכן.</li>
                <li>רכישות באתר מתבצעות באמצעות ספקי תשלום חיצוניים (כגון iCount, PayMe). המפעיל אינו שומר פרטי אשראי ואינו אחראי על תקלות אצל ספקים אלו.</li>
                <li>ביטול עסקה יתבצע בהתאם למדיניות הביטולים וההחזרים המפורסמת באתר ובהתאם לחוק הגנת הצרכן, התשמ"א–1981.</li>
                <li>המפעיל רשאי לבטל עסקה אם סבר שנעשתה שלא כדין, תוך הפרת תנאי שימוש, או בשל תקלה טכנית/לוגיסטית.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">5. זכויות יוצרים וקניין רוחני</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>כל זכויות היוצרים, סימני המסחר, התכנים, הקורסים, המדריכים, החומרים, העיצובים והקבצים באתר הם רכושו הבלעדי של המפעיל או צדדים שלישיים שהעניקו הרשאה.</li>
                <li>אין להעתיק, לשכפל, להפיץ, לפרסם, למסחר או לשדר כל תוכן מהאתר ללא אישור מראש ובכתב מהמפעיל.</li>
                <li>שימוש לא מורשה בתוכן יהווה הפרה של זכויות יוצרים וקניין רוחני ועלול להביא לנקיטת צעדים משפטיים.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">6. פרטיות והגנת מידע אישי</h2>
              <h3 className="text-xl font-semibold mb-2">6.1 עקרונות כלליים</h3>
              <ul className="space-y-2 mr-6 list-disc">
                <li>איסוף ועיבוד מידע ייעשה רק למטרות שהוגדרו מראש.</li>
                <li>לא יבוצע שימוש במידע מעבר למה שהמשתמש הוסמך או הסכים לו.</li>
                <li>המידע יישמר רק למשך הזמן הנדרש למטרות שהוגדרו.</li>
                <li>ינקטו אמצעים טכניים וארגוניים סבירים להבטחת המידע (הצפנה, בקרות גישה, גיבויים, בדיקות אבטחה).</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-2">6.2 מידע הנאסף</h3>
              <ul className="space-y-2 mr-6 list-disc">
                <li>פרטי זיהוי שנמסרו בהרשמה (שם, אימייל, טלפון).</li>
                <li>מידע טכני (כתובת IP, דפדפן, Device ID, Cookies).</li>
                <li>נתוני שימוש באתר (פעילות, העדפות, רכישות).</li>
                <li>מידע שמתקבל מצדדים שלישיים (כגון ספקי תשלום או כלי ניתוח).</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-2">6.3 מטרות השימוש במידע</h3>
              <ul className="space-y-2 mr-6 list-disc">
                <li>מתן שירותים (קורסים, ייעוץ, תכנים).</li>
                <li>ניהול קשר עם המשתמש, שליחת עדכונים ומידע שיווקי בהסכמה.</li>
                <li>ניתוח ושיפור חוויית המשתמש באתר.</li>
                <li>עמידה בהוראות חוק ובדרישות רשויות מוסמכות.</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-2">6.4 העברת מידע לצד שלישי</h3>
              <ul className="space-y-2 mr-6 list-disc">
                <li>מידע עשוי להיות מועבר לספקי שירותים (ענן, תשלום, דיוור).</li>
                <li>כל צד שלישי מחויב לשמור על סודיות ולעמוד בדרישות אבטחת מידע.</li>
                <li>העברת מידע מחוץ לישראל תבוצע רק למדינות המספקות רמת הגנה נאותה, או בהתאם להסכמים מתאימים.</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-2">6.5 זכויות המשתמש</h3>
              <p className="mb-2">בהתאם לחוק הגנת הפרטיות (תיקון 13), המשתמש זכאי:</p>
              <ul className="space-y-2 mr-6 list-disc">
                <li>לקבל מידע האם מוחזק עליו מידע אישי.</li>
                <li>לעיין במידע ולעדכן/לתקן פרטים שגויים.</li>
                <li>לדרוש מחיקת מידע שאינו נחוץ עוד.</li>
                <li>להתנגד לעיבוד מידע במקרים מסוימים.</li>
                <li>להגיש תלונה לרשות להגנת הפרטיות בישראל.</li>
              </ul>
              <p className="mt-2">בקשות ניתן לשלוח לדוא"ל: <a href="mailto:avi@ai-master.co.il" className="text-brand-accent hover:underline">avi@ai-master.co.il</a></p>
              <h3 className="text-xl font-semibold mt-6 mb-2">6.6 אירועי אבטחת מידע</h3>
              <ul className="space-y-2 mr-6 list-disc">
                <li>במקרה של אירוע אבטחה מהותי (כגון פריצה, דליפת נתונים) נתריע בפני הרשות להגנת הפרטיות כנדרש.</li>
                <li>נעדכן את המשתמשים שנפגעו בהתאם לחובות החוק.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">7. אחריות והגבלת אחריות</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>המפעיל עושה מאמצים לשמור על תקינות השירות, אך אינו מתחייב שהאתר יהיה חף מתקלות, הפרעות או שיבושים.</li>
                <li>השימוש באתר נעשה באחריות המשתמש בלבד.</li>
                <li>המפעיל לא יישא באחריות לנזקים ישירים או עקיפים שייגרמו עקב שימוש באתר או הסתמכות על המידע בו.</li>
                <li>המידע באתר ניתן "כפי שהוא" (AS IS) ואינו מהווה ייעוץ מקצועי מחייב.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">8. דין וסמכות שיפוט</h2>
              <ul className="space-y-3 mr-6 list-disc">
                <li>על התקנון יחולו אך ורק דיני מדינת ישראל.</li>
                <li>סמכות השיפוט הבלעדית בכל מחלוקת נתונה לבתי המשפט המוסמכים במחוז תל־אביב–יפו.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">9. יצירת קשר</h2>
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

export default PrivacyPolicy;