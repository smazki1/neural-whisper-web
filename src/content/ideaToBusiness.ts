/** Purchase links are managed in the vault product editor. */
export const ideaToBusiness = {
  price: 350,
  // Add approved screenshots under public/images/idea-to-business/.
  // alt should transcribe the relevant feedback for people using screen readers.
  // Populate only with real, approved assets supplied by Avi.
  examples: [] as Array<{ src: string; alt: string; caption: string }>,
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
export const upcomingCourseUnits = ["מבוא ל־GEN-AI", "היכרות עם הכלים", "עבודה חכמה עם AI", "Vibe Coding"];
