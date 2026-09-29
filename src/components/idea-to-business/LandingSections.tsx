import { Image as ImageIcon, ArrowLeft, Code2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ideaToBusiness } from "@/content/ideaToBusiness";
import type { ReactNode } from "react";

const wrap = "container mx-auto px-6 max-w-6xl";
const heading = "text-3xl md:text-4xl font-bold leading-tight text-balance";

/** Visible editorial placeholders are intentional in this unapproved draft. */
export function DraftNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`rounded-xl border border-dashed border-amber-500/60 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 ${className}`}><span className="font-bold">להשלמה עם אבי: </span>{children}</p>;
}

function ImageSlot({ label, className = "" }: { label: string; className?: string }) {
  return <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-400 bg-slate-100 p-5 text-center text-slate-600 ${className}`}><ImageIcon className="h-7 w-7 opacity-60" aria-hidden="true" /><span className="text-sm font-medium leading-relaxed">{label}</span><span className="text-xs">מקום שמור לתמונה אמיתית</span></div>;
}

export function SolutionSection() {
  return <section id="course-solution" className="bg-slate-900 py-16 md:py-24 text-white">
    <div className={`${wrap} grid gap-10 md:grid-cols-2 md:items-center`}>
      <div><p className="text-yellow-300 font-medium mb-4">מרעיון לדבר שאפשר לקדם</p><h2 className={heading}>דרך עבודה שחוזרים אליה,<br className="hidden md:block" /> בכל פעם שעולה רעיון חדש.</h2></div>
      <div className="space-y-6 text-lg text-slate-200 leading-relaxed"><p>להבין מה נכון לבנות, לפתח את ההצעה, ולהתחיל להפוך אותה למשהו שאפשר להציג, לנסות ולשפר.</p><p>במקום להתחיל בכל פעם מחדש, לומדים לחבר בין החשיבה העסקית לבין הבנייה בפועל בעזרת AI.</p><p className="text-yellow-300 font-semibold">יותר יכולת להחליט. יותר יכולת לבנות בעצמכם.</p></div>
    </div>
  </section>;
}

const situations = [
  { title: "יש לכם רעיון למוצר חדש?", text: "תדעו איך לבחון אותו, לחדד אותו ולהפוך אותו להצעה שאפשר להתחיל לצאת איתה לשוק." },
  { title: "צריכים דרך להציג ולמכור אותו?", text: "תדעו איך להתחיל לבנות את הדף, המסרים והנכסים שיעזרו לאנשים להבין מה אתם מציעים ולמה זה רלוונטי להם." },
  { title: "צריכים להתחיל לשווק?", text: "תוכלו להשתמש ב-AI כדי להפוך את הרעיונות והידע שלכם לתוכן, מסרים וחומרים שאפשר לעבוד איתם במקום להתחיל כל פעם מדף ריק." },
  { title: "ויש לכם רעיון לכלי, מחשבון, סימולטור או מוצר דיגיטלי?", text: "תוכלו להתחיל להפוך גם אותו לגרסה שאפשר לראות, לנסות ולשפר." },
];

export function PossibilitiesSection() {
  return <section id="possibilities" className="bg-slate-50 py-16 md:py-24 text-slate-900">
    <div className={wrap}>
      <div className="max-w-3xl mx-auto text-center mb-10"><h2 className={`${heading} text-blue-900 mb-6`}>אז מה בעצם תוכלו לעשות עם כל זה?</h2><p className="text-lg leading-relaxed">המטרה של הקורס היא לא להפוך אתכם לאנשי שיווק, מתכנתים, קופירייטרים ומעצבים.</p><p className="text-lg leading-relaxed mt-3">המטרה היא שבפעם הבאה שיעלה לכם רעיון בעסק, לא תיתקעו בשאלה:</p><p className="text-2xl md:text-3xl font-bold text-blue-900 mt-5">״אוקיי... ומה עכשיו?״</p></div>
      <div className="grid md:grid-cols-2 gap-x-12">
        {situations.map((item, index) => <article key={item.title} className="border-t border-slate-300 py-7"><div className="flex items-start gap-4"><span className="text-sm text-blue-700 font-bold pt-1" aria-hidden="true">0{index + 1}</span><div><h3 className="text-xl font-bold mb-3">{item.title}</h3><p className="text-slate-600 text-lg leading-relaxed">{item.text}</p></div></div></article>)}
      </div>
      <p className="max-w-3xl mx-auto text-center text-lg leading-relaxed mt-8"><strong>לא כדי לעשות הכול לבד לנצח.</strong><br />אלא כדי שתוכלו להזיז את העסק קדימה בלי שכל רעיון חדש מתחיל בחיפוש אחר האדם הבא שיעשה אותו בשבילכם.</p>
    </div>
  </section>;
}

const journey = [
  { title: "להבין מה נכון לבנות", text: "לחדד את העסק, הקהל והבעיה שרוצים לפתור, כדי שהדברים שתבנו יישענו על צורך אמיתי ולא רק על תחושת בטן." },
  { title: "להפוך רעיון למוצר ולהצעה", text: "לפתח ולחדד מוצרים, להבין את הערך שלהם ולהפוך אותם להצעה שקל יותר להסביר, להציג ולבדוק." },
  { title: "לבנות את הדרך לשוק", text: "להפוך את ההצעה לדף, מסרים ונכסים שיעזרו להתחיל להוציא אותה החוצה." },
  { title: "לבנות דברים שפעם דרשו בעל מקצוע", text: "להשתמש ב-AI וב-Vibe Coding כדי להתחיל ליצור כלים, אפליקציות קטנות, מוצרי טעימה ונכסים עסקיים בעצמכם." },
  { title: "להמשיך לפתח את העסק", text: "להשתמש באותה דרך חשיבה גם בהמשך, כאשר צריך תוכן, לידים, כלים, מערכות או מוצר חדש." },
];

export function JourneySection() {
  return <section id="curriculum" className="bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 py-16 md:py-24 text-white">
    <div className={`${wrap} grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20`}>
      <div><p className="text-yellow-300 mb-4 font-medium">מסלול הליבה</p><h2 className={`${heading} mb-6`}>מכאן מתחילים לבנות</h2><p className="text-slate-300 text-lg leading-relaxed">רעיון אחד, תהליך מתמשך. כל שלב נשען על מה שבניתם בשלב שלפניו.</p><DraftNote className="mt-6">רשימת היחידות הזמינות והיחידות שבפיתוח. זו מפת המסלול, ולא אישור שכל חמשת השלבים כבר זמינים לצפייה.</DraftNote></div>
      <ol className="relative space-y-8 before:absolute before:top-5 before:bottom-5 before:right-5 before:w-px before:bg-white/20">
        {journey.map((item, index) => <li key={item.title} className="relative flex gap-5"><span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 border border-yellow-300/60 text-yellow-300 font-bold">{index + 1}</span><div className="pt-1"><h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3><p className="text-slate-300 text-lg leading-relaxed">{item.text}</p></div></li>)}
      </ol>
    </div>
  </section>;
}

export function VibeCodingSection() {
  return <section id="building-products" className="bg-white py-16 md:py-24 text-slate-900">
    <div className={`${wrap} grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center`}>
      <div><h2 className={`${heading} text-blue-900 mb-6`}>ולפעמים, הדבר שאתם בונים הוא המוצר עצמו</h2><div className="text-lg leading-relaxed space-y-4"><p>AI לא רק עוזר לכם לשווק מהר יותר.</p><p>בעזרת Vibe Coding אפשר לקחת רעיון שהיה נשאר פעם במחברת ולהתחיל להפוך אותו לכלי אמיתי שאנשים יכולים להשתמש בו.</p><p>לפעמים תבנו כלי שיעזור למכור את המוצר הקיים שלכם. ולפעמים תתחילו לבנות משהו קטן ותגלו שהוא בעצמו יכול להפוך למוצר חדש.</p></div><DraftNote className="mt-6">זמינות יחידות Vibe Coding ממתינה לאישור. יחידות שטרם זמינות יסומנו ״בקרוב״ או ״בפיתוח״.</DraftNote></div>
      <div className="rounded-2xl bg-slate-900 p-7 md:p-10 text-white"><Code2 className="h-8 w-8 text-yellow-300 mb-6" aria-hidden="true" /><p className="text-slate-300 mb-5">זה יכול להיות</p><ul className="grid grid-cols-2 gap-x-4 gap-y-4 text-lg">{["מחשבון", "סימולטור", "מחולל", "כלי שנותן המלצה אישית", "אפליקציה קטנה", "מערכת פנימית", "מוצר דיגיטלי חדש"].map(x => <li key={x} className="border-b border-white/15 pb-3">{x}</li>)}</ul><p className="text-xl font-semibold text-yellow-300 leading-relaxed mt-7">לא רק לבנות את מה שעוטף את המוצר שלכם.<br />עם AI אפשר להתחיל לבנות גם את המוצר עצמו.</p></div>
    </div>
  </section>;
}

export function OutputsSection() {
  const { examples } = ideaToBusiness;
  return <section id="examples" className="bg-slate-100 py-16 md:py-24 text-slate-900">
    <div className={wrap}><h2 className={`${heading} text-blue-900 mb-6`}>דברים שפעם היו נשארים רעיון</h2><DraftNote className="mb-8 max-w-3xl">יש לבחור 3–6 פרויקטים אמיתיים, לספק תמונה ומשפט לכל פרויקט ולהחליט אם לכלול את FoodVision. המקומות השמורים אינם דוגמאות לתוצרים.</DraftNote>
      <div className="grid gap-6 md:grid-cols-2">
        {examples.length ? examples.map(item => <figure key={item.src} className="min-w-0"><img src={item.src} alt={item.alt} loading="lazy" className="w-full aspect-[16/10] object-contain rounded-2xl bg-white border border-slate-200" /><figcaption className="mt-4 text-lg font-medium">{item.caption}</figcaption></figure>) : [1, 2, 3, 4].map(n => <ImageSlot key={n} label={`פרויקט ${n} · צילום ומשפט מאבי`} className="aspect-[16/10]" />)}
      </div>
    </div>
  </section>;
}

const library = [
  { title: "לבנות את הדרך למכירה", text: "דפי נחיתה, דפי הרשמה, איסוף לידים, דפי תודה, הצעות מחיר ונכסים שהלקוחות פוגשים בדרך לרכישה." },
  { title: "להפוך תוכן לתנועה בעסק", text: "פוסטים, קרוסלות, תסריטים, ארגון תוכן וחיבור בין תוכן לבין מטרות עסקיות." },
  { title: "לעשות סדר במה שקורה אחרי שמגיע ליד", text: "כלים ותהליכים לניהול לידים ועבודה מסודרת יותר." },
  { title: "לבנות מוצרים וכלים עם AI", text: "Vibe Coding, אפליקציות קטנות, מוצרי טעימה חכמים וכלים אינטראקטיביים." },
];

export function LibrarySection() {
  return <section id="growing-library" className="bg-slate-900 py-16 md:py-24 text-white">
    <div className={wrap}><div className="max-w-3xl mb-10"><h2 className={`${heading} mb-6`}>והקורס ממשיך להתפתח יחד עם הדרך שבה AI משנה את העסק</h2><p className="text-lg leading-relaxed text-slate-300">״מרעיון לעסק״ הוא לא קורס שבניתי פעם אחת והשארתי כמו שהוא.</p><p className="text-lg leading-relaxed text-slate-300 mt-4">אני ממשיך להוסיף אליו שיעורים פרקטיים מתוך הדברים שאני בעצמי בונה, בודק ומשתמש בהם בעבודה.</p></div>
      <DraftNote className="mb-8">חלק מהתכנים עדיין בפיתוח. נדרשות רשימות היחידות הזמינות והיחידות שיסומנו ״בקרוב״ או ״בפיתוח״. התחומים הבאים אינם רשימת יחידות זמינות לצפייה.</DraftNote>
      <div className="grid gap-x-12 md:grid-cols-2">{library.map(item => <article key={item.title} className="py-7 border-t border-white/20"><span className="inline-block text-xs font-medium text-yellow-200 border border-yellow-200/40 px-2 py-1 rounded mb-4">זמינות ממתינה לאישור</span><h3 className="text-xl font-bold mb-3">{item.title}</h3><p className="text-slate-300 text-lg leading-relaxed">{item.text}</p></article>)}</div>
      <p className="max-w-3xl text-lg leading-relaxed mt-8">המטרה היא לא שתצטרכו את כל הדברים האלה ביום הראשון. המטרה היא שככל שהעסק שלכם מתקדם, יהיו לכם בתוך הקורס כלים שיעזרו לכם לבנות את הדבר הבא שאתם צריכים.</p>
      <DraftNote className="mt-6 max-w-3xl">החלטה לגבי גישת רוכשי מחיר ההשקה ליחידות עתידיות ולגבי תשלום נוסף, אם יהיה.</DraftNote>
    </div>
  </section>;
}

const photoLabels = ["תמונה מרכזית · אבי מול קהל", "תמונה מסדנה", "אבי בעבודה", "עבודה עם צוות או ארגון", "תמונה מהרצאה"];
const collagePositions = ["md:col-span-2 md:row-span-2 md:rotate-[-2deg]", "md:rotate-[3deg] md:-mr-5 md:mt-6", "md:rotate-[-3deg] md:-mr-3", "md:rotate-[2deg]", "md:col-span-2 md:rotate-[-1deg] md:-mt-4"];

export function AboutAviSection() {
  const { aviPhotos } = ideaToBusiness;
  return <section id="about-avi" className="bg-stone-50 py-16 md:py-24 text-slate-900 overflow-hidden">
    <div className={wrap}><h2 className={`${heading} text-blue-900 max-w-3xl mb-12`}>אני לא מלמד AI מהצד.<br />אני משתמש בו כדי לבנות דברים אמיתיים.</h2>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:py-5">
          {(aviPhotos.length ? aviPhotos : photoLabels.map(alt => ({ src: "", alt }))).map((photo, i) => <div key={photo.src || photo.alt} className={`relative min-w-0 rounded-2xl md:shadow-md ${collagePositions[i % collagePositions.length]}`}>{photo.src ? <img src={photo.src} alt={photo.alt} loading="lazy" className="w-full h-full min-h-36 object-cover rounded-2xl" /> : <ImageSlot label={photo.alt} className="h-full min-h-36 md:min-h-44" />}</div>)}
        </div>
        <div className="space-y-5 text-lg leading-relaxed"><p className="font-bold text-xl">אני אבי פריד, מרצה, יזם ויוצר בתחום ה-AI.</p><p>בשנים האחרונות אני עובד עם בעלי עסקים, צוותים וארגונים על שאלה אחת שחוזרת שוב ושוב:</p><p className="text-xl font-semibold text-blue-900 border-r-4 border-yellow-400 pr-5">איך לוקחים את כל מה ש-AI יודע לעשות והופכים אותו למשהו שבאמת מקדם את העבודה או את העסק?</p><p>אני בעצמי משתמש ב-AI כדי לחקור, לפתח רעיונות, לבנות מוצרים, ליצור דפי נחיתה, לפתח כלים ואפליקציות ולבדוק דרכים חדשות להפוך רעיון למשהו שעובד בעולם האמיתי.</p><p>את הקורס הזה בניתי מתוך אותו תהליך בדיוק.</p><p>לא כדי ללמד אתכם עוד רשימה של כלים, אלא כדי לתת לכם דרך עבודה שתעזור לכם לחשוב, לבנות ולבצע יותר בעצמכם.</p><DraftNote>4–6 תמונות אמיתיות ונתוני סמכות מאומתים: הרצאות, משתתפים, ארגונים או שנות ניסיון. לא מוצגים מספרים לפני אישור.</DraftNote></div>
      </div>
    </div>
  </section>;
}

const feedbackSizes = ["min-h-64", "min-h-44", "min-h-56", "min-h-48", "min-h-72", "min-h-44", "min-h-60", "min-h-52", "min-h-48", "min-h-64"];
const feedbackRotation = ["md:rotate-[-1deg]", "md:rotate-[1.5deg]", "md:rotate-[-0.5deg]"];

export function TestimonialsSection() {
  const { testimonials } = ideaToBusiness;
  return <section id="feedback" className="bg-slate-100 py-16 md:py-24 text-slate-900 overflow-hidden">
    <div className={wrap}><h2 className={`${heading} text-blue-900 text-center mb-6`}>אל תיקחו רק את המילה שלי</h2>
      {!testimonials.length && <DraftNote className="max-w-3xl mx-auto mb-10">8–15 צילומי מסך אמיתיים של פידבקים. זהו שלד עיצובי בלבד, ללא עדויות או הודעות מומצאות.</DraftNote>}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-3 md:block md:columns-3 lg:columns-4 md:gap-5 md:overflow-visible">
        {(testimonials.length ? testimonials : feedbackSizes.map((_, i) => ({src: "", alt: `צילום עדות ${i + 1} · ממתין לתמונה מאבי`}))).map((item, i) => <figure key={item.src || item.alt} className={`w-[78%] shrink-0 snap-center md:w-auto md:break-inside-avoid mb-5 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm ${feedbackRotation[i % feedbackRotation.length]}`}>{item.src ? <img src={item.src} alt={item.alt} loading="lazy" className="w-full h-auto rounded-xl" /> : <ImageSlot label={item.alt} className={feedbackSizes[i % feedbackSizes.length]} />}</figure>)}
      </div>
    </div>
  </section>;
}

export function TimeSection() {
  return <section id="time" className="bg-white py-16 md:py-24 text-slate-900">
    <div className={wrap}><h2 className={`${heading} text-blue-900 max-w-3xl mb-8`}>״אבל אין לי זמן עכשיו לשבת ולבנות את כל זה״</h2><div className="grid gap-10 md:grid-cols-2"><div className="space-y-4 text-lg leading-relaxed"><p><strong>נכון. הקורס הזה כן דורש עבודה.</strong></p><p>אין פה כפתור שתלחצו עליו ובבוקר יהיה לכם עסק חדש.</p><p>אבל אם אתם ממילא רוצים לפתח מוצר, לבנות דף, להבין את הקהל או להתחיל לשווק משהו חדש, הזמן הזה יידרש בכל מקרה.</p><p className="text-2xl font-bold text-blue-900">השאלה היא איפה הוא ילך.</p></div><div className="border-r border-slate-300 pr-6"><p className="text-lg mb-4">אפשר לבזבז אותו על:</p><ul className="space-y-3 text-slate-600 text-lg">{["עשרות סרטוני YouTube.", "חיפוש אחרי הכלי הנכון.", "ניסוי של עוד עשרה פרומפטים.", "התכתבויות עם ספקים.", "לבנות משהו, לגלות שהוא לא נכון ולהתחיל מחדש."].map(x => <li key={x} className="flex gap-3"><ArrowLeft className="h-5 w-5 shrink-0 mt-1" aria-hidden="true" />{x}</li>)}</ul></div></div><div className="mt-10 border-t border-slate-200 pt-8 text-lg leading-relaxed max-w-4xl"><p>או שאפשר לעבוד לפי תהליך מסודר שמוביל אתכם בכל פעם לדבר הבא שצריך לעשות.</p><p className="mt-5 text-xl font-bold text-blue-900">המטרה של הקורס היא לא לגרום לעסק לא לדרוש עבודה.<br />המטרה היא לגרום לעבודה שלכם להיות הרבה יותר ממוקדת.</p></div></div>
  </section>;
}

const faqs = [
  { q: "צריך כבר עסק קיים?", a: "לא. אפשר להגיע עם ידע, ניסיון או רעיון שרוצים לפתח. הקורס מתאים גם לבעלי עסקים שרוצים לחדד מוצר קיים או לבנות מוצר חדש." },
  { q: "צריך לדעת לעבוד עם AI?", a: "צריך ידע בסיסי במחשב ובדפדפן וחשבון ChatGPT. אפשר להתחיל בחשבון חינמי. לאורך הקורס עובדים על הרעיון או העסק שלכם בעזרת הדגמות והנחיות." },
  { q: "אני לא טכנולוגי, זה בשבילי?", a: "לא צריך ניסיון בכתיבת קוד. כן צריך נכונות להתנסות, ללמוד ולבדוק את מה שבונים. AI עוזר בתהליך, ואתם מקבלים את ההחלטות." },
  { q: "כמה זמן צריך להשקיע?", a: "זהו קורס מוקלט ללמידה בקצב שלכם. היישום דורש זמן ועבודה, בהתאם לרעיון ולמה שתרצו לבנות. אפשר להתקדם שלב אחר שלב; אין כאן הבטחה לעסק מוכן בלחיצת כפתור." },
  { q: "יש לי כבר עסק ואתר, האם הקורס עדיין רלוונטי?", a: "כן. אפשר לעבוד על מוצר חדש, לחדד הצעה קיימת או לפתח כלי שיעזור לעסק. אין צורך להתחיל את העסק מחדש." },
  { q: "מה זמין בקורס כרגע ומה יתווסף בהמשך?", todo: "רשימת היחידות שכבר זמינות ורשימת היחידות שיסומנו ״בקרוב״ או ״בפיתוח״. עד לקבלת הרשימות אין כאן התחייבות לזמינות של יחידה מסוימת." },
  { q: "האם יש גישה לתכנים עתידיים?", todo: "מדיניות הגישה ליחידות עתידיות לרוכשי מחיר ההשקה, כולל השאלה אם תהיה תוספת תשלום. התשובה הסופית טרם נקבעה." },
];

export function FAQSection() {
  return <section id="faq" className="bg-white py-16 md:py-24 text-slate-900"><div className="container mx-auto px-6 max-w-4xl"><h2 className={`${heading} text-blue-900 mb-10`}>לפני שמתחילים, כמה תשובות</h2><Accordion type="single" collapsible dir="rtl">{faqs.map((item, i) => <AccordionItem key={item.q} value={`faq-${i}`} className="border-slate-200"><AccordionTrigger className="text-right text-lg md:text-xl gap-5 py-6">{item.q}</AccordionTrigger><AccordionContent className="text-base md:text-lg leading-relaxed text-slate-600">{item.todo ? <DraftNote>{item.todo}</DraftNote> : item.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>;
}

export function ReviewChecklist() {
  return <aside id="review-items" className="bg-amber-50 text-amber-950 border-y border-amber-200 py-10"><div className={`${wrap} max-w-4xl`}><h2 className="text-xl font-bold mb-5">טיוטה לבדיקה · מה נשאר להשלים לפני פרסום</h2><ul className="grid sm:grid-cols-2 gap-3 text-sm leading-relaxed">{["נוסח CTA סופי", "מחיר מלא עתידי", "מדיניות גישה לעדכונים עתידיים", "תמונות אבי, הרצאות וסדנאות", "צילומי מוצרים וכלים ובחירת פרויקטים", "עדויות משתתפים אמיתיות", "נתוני סמכות מאומתים", "החלטה אם להציג את FoodVision", "רשימת היחידות שכבר זמינות", "רשימת היחידות שבקרוב או בפיתוח"].map(x => <li key={x} className="flex gap-2"><span aria-hidden="true">○</span><span>{x}</span></li>)}</ul></div></aside>;
}
