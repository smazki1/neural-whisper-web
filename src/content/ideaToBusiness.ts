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
  aviPhotos: [] as Array<{ src: string; alt: string }>,
  testimonials: [] as Array<{ src: string; alt: string }>,
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
