/** Purchase links are managed in the vault product editor. */
export const ideaToBusiness = {
  price: 350,
  // Add approved screenshots under public/images/idea-to-business/.
  // alt should transcribe the relevant feedback for people using screen readers.
  // Populate only with real, approved assets supplied by Avi.
  examples: [
    { title: "עיצוב חדרים עם AI", src: "/media/idea-to-business/room-design.mp4", poster: "/media/idea-to-business/room-design-poster.jpg", alt: "מדמיינים מחדש את החדר", caption: "מעלים תמונה של החדר ומקבלים הדמיית עיצוב שאפשר להשוות למקור." },
    { title: "יצירת קרוסלות", src: "/media/idea-to-business/carousel-builder.mp4", poster: "/media/idea-to-business/carousel-builder-poster.jpg", alt: "מהידע שלכם לקרוסלה", caption: "הופכים רעיון לרצף שקפים, עם מסרים ועיצוב שאפשר לערוך." },
    { title: "מחירון ממותג", src: "/media/idea-to-business/branded-pricelist.mp4", poster: "/media/idea-to-business/branded-pricelist-poster.jpg", alt: "מחירון שמדבר בשפה של העסק", caption: "בונים מחירון מעוצב ומותאם למותג, לשירותים ולמחירים שלכם." },
    { title: "צילום מוצר עם AI", src: "/media/idea-to-business/product-photography.mp4", poster: "/media/idea-to-business/product-photography-poster.jpg", alt: "מתמונת מוצר לצילום שיווקי", caption: "מעלים תמונת מוצר והופכים אותה לתמונה עם רקע ואווירה חדשים." },
  ],
  aviPhotos: [
    { src: "/images/idea-to-business/avi-workshop-audience.jpg", alt: "אבי מרצה בסדנה מול משתתפים שעובדים עם מחשבים ניידים", position: "50% 76%" },
    { src: "/images/idea-to-business/avi-workshop-teaching.jpg", alt: "אבי מסביר למשתתפים בסדנה מעשית", position: "60% 70%" },
    { src: "/images/idea-to-business/avi-lecture.jpg", alt: "אבי במהלך הרצאה, לצד פודיום ולוח", position: "48% 45%" },
    { src: "/images/idea-to-business/avi-hands-on-guidance.png", alt: "אבי מסייע למשתתפים בעבודה אישית מול המחשב", position: "50% 65%" },
  ],
  testimonials: [
    { src: "/images/idea-to-business/testimonial-business-plan.png", alt: "עדות משתתף: למדתי לכוון את הצ׳אט לדברים שאני צריך. הוא בנה לי תוכנית עסקית מלאה כולל תקציב, אנשי מקצוע וזמנים. הדבר חסך לי שבועות של עבודה. כיום הוא יוצר לי תכנים, תיאורים למוצרים ומיילים, ולדברי המשתתף חוסך יותר מ־60 אחוז מזמן העבודה." },
    { src: "/images/idea-to-business/testimonial-business-clarity.png", alt: "עדות משתתפת: למדתי ליצור סדר ושלד ברור ומובן לעסק בעזרת הצ׳אט, לפתח את הנישה העסקית, למצוא את הערכים, נקודות הכאב והייחודיות. תודה על קורס מקיף ומעשיר שמקל עליי באפיון ובמיקוד העסק." },
    { src: "/images/idea-to-business/testimonial-business-focus.png", alt: "תודה ענקית על קורס מקיף ומעשיר! מרגישה שהידע שקיבלתי בקורס מקל עליי באפיון ומיקוד העסק שלי." },
    { src: "/images/idea-to-business/testimonial-learning-experience.png", alt: "המון תודה אבי, אתה מעביר את החומר בכיף וחיוך ומלא תשוקה וסקרנות. למדתי כל כך הרבה דברים חדשים ולא פחות חשוב, זה היה מעניין!" },
    { src: "/images/idea-to-business/testimonial-everyday-ai.png", alt: "עדות הומוריסטית על הקורס: פעם הייתה לי הרבה עבודה והיום את הרוב ChatGPT עושה; אני מבלה איתו יותר מאשר עם אשתי. ועכשיו ברצינות: תודה רבה לך אבי על כל הטוב הזה!" },
  ],
};

// Course metadata checked on 2026-09-29. Only non-upcoming lessons with
// video or resources are listed. The digital-product bonus was confirmed by Avi.
export const availableCourseModules = [
  { title: "מתחילים מכאן", lessons: ["ברוכים הבאים לקורס", "איך הקורס עובד - הכנת סביבת העבודה"] },
  { title: "יסודות העסק", lessons: ["מציאת הנישה הייחודית שלך", "מחקר שוק וקהל יעד", "לגרום ל‑AI להפסיק להישמע כמו AI", "זהות ויזואלית", "פיתוח פרסונה מורחב"] },
  { title: "מוצרים והצעה", lessons: ["מפת מוצרים", "פיתוח הצעה"] },
  { title: "בניית דף נחיתה", lessons: ["בניית דף נחיתה חלק 1", "בניית דף נחיתה חלק 2", "חיבור דומיין"] },
  { title: "בונוסים וחומרי עזר", lessons: ["חומרי עזר", "שינוי כיוון תצוגה (ימין לשמאל)"] },
];
export const digitalProductBonus = "מוצר דיגיטלי לחדירה לשוק";
// Editorial candidates collected from Avi's course project, ACTIONS and Notes and Ideas.
// These are proposed additions for review, not a published syllabus or release schedule.
export const upcomingCourseGroups = [
  { title: "תוכן שיווקי בשפה של העסק", items: [
    "בנק רעיונות תוכן מתוך שאלות, כאבים והתנגדויות של הלקוחות",
    "פוסטים שיווקיים בשפת המותג",
    "קרוסלות: מרעיון לרצף שקפים ולעיצוב",
    "תסריטים לרילס ולסרטוני מכירה",
    "פליירים למוצר, שירות, סדנה או אירוע",
    "הצעות מחיר מעוצבות ומותאמות ללקוח",
  ] },
  { title: "מתוכן לפניות ומפניות ללקוחות", items: [
    "חיבור התוכן למוצר טעימה ולמסלול הרשמה",
    "טפסים, איסוף פרטים והמשך הדרך אחרי ההרשמה",
    "בניית רשימת תפוצה ומסירת מוצר טעימה במייל",
    "רצפי מיילים שממשיכים את הקשר עם המתעניינים",
    "CRM שמתחבר לאתר ומרכז את הפניות",
    "מעקב אחר לקוחות, סטטוסים והפעולה הבאה",
    "אוטומציית התראה ומעקב אחרי ליד חדש",
  ] },
  { title: "מוצרים וכלים חכמים בהתאמה לעסק", items: [
    "בניית כלים ואפליקציות עסקיות עם AI ו־Vibe Coding",
    "מחשבונים וסימולטורים שמציגים תוצאה אישית",
    "שאלוני אבחון ומחוללי המלצות",
    "מוצרי טעימה אינטראקטיביים שממחישים את הערך שלכם",
    "כלי AI שמסייע ללקוח לבחור מוצר או לבנות תוכנית פעולה",
  ] },
  { title: "להעמיק במחקר ולזהות הזדמנויות", items: [
    "מחקר שוק מתקדם: ביקוש, מגמות ומקורות אמינים",
    "השוואת ממצאים ממחקרי AI וקבלת החלטות עסקיות",
    "זיהוי כיוונים חדשים לעסק מתוך חומרים וידע שכבר קיימים",
  ] },
];
