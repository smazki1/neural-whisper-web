import { HoverDemo } from "./HoverDemo";
import { KnowledgeTakesShape } from "./KnowledgeTakesShape";
import { ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroBackground03 from "@/assets/backgrounds/hero/hero-background-03.png";
import { availableCourseModules, upcomingCourseGroups, ideaToBusiness } from "@/content/ideaToBusiness";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const wrap = "container mx-auto px-6 max-w-6xl font-medium";
const heading = "text-3xl md:text-4xl font-bold leading-tight text-balance";

/** Visible editorial placeholders are intentional in this unapproved draft. */
export function DraftNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`rounded-xl border border-dashed border-amber-500/60 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 ${className}`}><span className="font-bold">להשלמה עם אבי: </span>{children}</p>;
}

export function SolutionSection() {
  const reducedMotion = useReducedMotion();
  const initial = reducedMotion ? false : { opacity: 0, y: 24 };
  const visible = { opacity: 1, y: 0 };

  return <section id="course-solution" className="bg-slate-900 py-16 md:py-24 text-white">
    <div className={`${wrap} grid gap-10 md:gap-14 md:grid-cols-2 md:items-center`}>
      <motion.div initial={initial} whileInView={visible} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.65 }}>
        <p className="text-xl md:text-2xl text-yellow-300 font-bold mb-5">מרעיון למוצר שאפשר להתחיל למכור</p>
        <h2 className={heading}>דרך עבודה שחוזרים אליה,<br className="hidden md:block" /> בכל פעם שעולה רעיון חדש.</h2>
        <p className="mt-7 text-xl md:text-2xl leading-relaxed text-yellow-300 font-bold">יותר יכולת להחליט.<br />יותר יכולת לבנות בעצמכם.</p>
      </motion.div>
      <motion.div className="space-y-7 text-xl md:text-2xl text-slate-100 font-medium leading-relaxed" initial={initial} whileInView={visible} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : 0.12 }}>
        <p>יש לכם רעיון למוצר או לעסק? תלמדו לחבר אותו להצעה ברורה ולבנות את מה שצריך כדי להתחיל לשווק ולמכור ללקוחות.</p>
        <p>מהרגע שיש לכם כיוון ברור, AI הופך לכלי שמחבר בין הרעיון, ההצעה, המסרים והנכסים של העסק, כך שתוכלו להתקדם מהר יותר עם הרבה פחות ניחושים ותלות באחרים.</p>
      </motion.div>
    </div>
  </section>;
}

const situations = [
  { title: "רעיון שהופך להצעה ברורה", text: "במקום להישאר עם רעיון כללי, תחדדו למי הוא מיועד, מה באמת חשוב ללקוח ואיך להפוך אותו להצעה שקל להבין, להציג ולמכור." },
  { title: "מותג שמרגיש מדויק ועקבי", text: "תחברו בין הקהל, הקול והזהות הוויזואלית כדי שהעסק ירגיש כמו מותג אחד ברור, ולא כמו אוסף של ניסוחים, צבעים ופוסטים שלא מדברים יחד." },
  { title: "בנק תוכן שמדבר בשפה של המותג", text: "תשתמשו בשפה ובמסרים שכבר גיבשתם כדי לבנות בנק תוכן בשפת המותג שלכם, עם רעיונות שאפשר להפוך לפוסטים, קרוסלות ותסריטים בלי להתחיל כל פעם מחדש." },
  { title: "דרך ברורה להגיע לשוק", text: "תתכננו איפה לפגוש את הקהל, איך להציג את המוצר ואילו פעולות יעזרו לחשוף אותו לאנשים הרלוונטיים, גם בלי להתחיל מתקציב לפרסום ממומן." },
  { title: "רעיון שהופך לכלי אמיתי", text: "תוכלו לקחת את הידע הייחודי שלכם ולבנות כלי שמותאם בדיוק לעסק ולקהל שלכם. להציע ערך חדש בדרך משלכם, לתת ללקוחות סיבה לבחור דווקא בכם ולבלוט מעבר לעוד הבטחה שיווקית." },
];

export function PossibilitiesSection() {
  const reducedMotion = useReducedMotion();
  return <section id="possibilities" className="relative bg-gradient-to-br from-blue-950 via-purple-900 to-slate-900 py-16 md:py-20 text-white">
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true"><div className="absolute inset-0 bg-cover bg-center opacity-[0.12]" style={{ backgroundImage: `url(${heroBackground03})` }} /></div>
    <div className={`${wrap} relative`}>
      <header className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <h2 className={`${heading} mb-5`}>מה תוכלו לבנות עם היכולת הזאת</h2>
        <p className="text-xl text-slate-100 leading-relaxed">מהרעיון וההצעה, דרך השפה של המותג, ועד הדרך שבה הלקוחות פוגשים אתכם.</p>
      </header>
      <div id="business-scenarios" className="max-w-5xl mx-auto space-y-6 md:space-y-7">
        {situations.map(item => <motion.article key={item.title} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.6 }} className="rounded-2xl border border-white/25 bg-white/10 p-6 md:px-8 md:py-7">
          <div className="flex items-start gap-3 md:gap-5 mb-3">
            <CheckCircle className="mt-2 h-6 w-6 shrink-0 text-green-400" aria-hidden="true" />
            <h3 className="min-w-0 flex-1 text-xl md:text-2xl font-bold">{item.title}</h3>
          </div>
          <p className="text-lg md:text-xl text-slate-100 leading-relaxed md:pr-11">{item.text}</p>
        </motion.article>)}
      </div>
    </div>
  </section>;
}

export function VibeCodingSection() {
  return <section id="building-products" className="border-t border-white/10 bg-slate-900 py-16 md:py-24 text-slate-200">
    <div className={`${wrap} grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center`}>
      <div><h2 className={`${heading} text-white mb-8`}>ולפעמים, הדבר שאתם בונים הוא המוצר עצמו</h2><div className="text-xl md:text-2xl leading-relaxed space-y-6"><p>AI לא רק עוזר לכם לשווק מהר יותר.</p><p>בעזרת Vibe Coding אפשר לקחת רעיון שהיה נשאר פעם במחברת ולהתחיל להפוך אותו לכלי אמיתי שאנשים יכולים להשתמש בו.</p></div></div>
      <div className="w-full max-w-[502px] min-w-0 rounded-2xl bg-slate-900 text-white"><KnowledgeTakesShape /></div>
    </div>
  </section>;
}

export function OutputsSection() {
  return <section id="examples" className="bg-slate-100 py-16 md:py-24 text-slate-900">
    <div className={wrap}>
      <h2 className={`${heading} text-blue-900 mb-10 md:mb-14`}>דברים שפעם היו נשארים רעיון</h2>
      <div className="grid gap-7 md:gap-10 md:grid-cols-2">
        {ideaToBusiness.examples.map(demo => <HoverDemo key={demo.src} demo={demo} />)}
      </div>
    </div>
  </section>;
}

const library = [
  { title: "להפוך תוכן לתנועה בעסק", text: "קרוסלות, פוסטים ותסריטים שמחברים בין הידע שלכם לבין מה שמעניין את הלקוחות.", kind: "content" },
  { title: "לבנות מוצרים וכלים עם AI", text: "להפוך את הידע שלכם לכלים חכמים, מוצרים אינטראקטיביים ואפליקציות שמותאמים לעסק שלכם.", kind: "tools" },
  { title: "לעשות סדר במה שקורה אחרי שמגיע ליד", text: "CRM, דיוור ומעקב מסודר שמחברים בין הפנייה הראשונה לבין הצעד הבא עם כל לקוח.", kind: "crm" },
];

function ComingSoonArt({ kind }: { kind: string }) {
  return <div className={`coming-soon-art coming-soon-art--${kind}`} aria-hidden="true">
    <img src={heroBackground03} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
    {kind === "content" ? <div className="future-content-stack">{[0, 1, 2].map(n => <div className="future-content-sheet" key={n}><span /><i /><i /><b /></div>)}</div>
      : kind === "crm" ? <div className="future-crm-board">{[0, 1, 2].map(n => <div key={n}><span />{[0, 1, 2].slice(0, n === 1 ? 2 : 3).map(k => <i key={k} />)}</div>)}</div>
      : <div className="future-tool-window"><div className="flex gap-1.5 mb-5"><i /><i /><i /></div><Sparkles className="h-9 w-9 text-violet-200 mx-auto mb-4" /><span className="future-tool-input" /><span className="future-tool-result" /></div>}
  </div>;
}

export function LibrarySection() {
  return <section id="growing-library" className="bg-slate-900 py-16 md:py-24 text-white">
    <div className={wrap}>
      <div className="max-w-3xl mx-auto text-center mb-10"><h2 className={`${heading} mb-6`}>והקורס ממשיך להתפתח יחד עם הדרך שבה AI משנה את העסק</h2><p className="text-lg leading-relaxed text-slate-300">״מרעיון לעסק״ הוא לא קורס שבניתי פעם אחת והשארתי כמו שהוא.</p><p className="text-lg leading-relaxed text-slate-300 mt-4">אני ממשיך להוסיף אליו שיעורים פרקטיים מתוך הדברים שאני בעצמי בונה, בודק ומשתמש בהם בעבודה.</p></div>
      <div className="grid gap-6 lg:grid-cols-3">{library.map(item => <article key={item.title} className="future-library-card rounded-2xl border border-white/15 bg-white/[0.04] overflow-hidden">
        <div className="relative"><ComingSoonArt kind={item.kind} /><span className="coming-soon-badge"><Sparkles className="h-4 w-4" aria-hidden="true" />בקרוב</span></div>
        <div className="p-6 text-center"><h3 className="text-2xl font-bold mb-4">{item.title}</h3><p className="text-slate-200 text-lg leading-relaxed">{item.text}</p></div>
      </article>)}</div>
      <DraftNote className="mt-8 max-w-3xl">רשימת ההרחבות בהמשך היא טיוטה רחבה לבחירתך. יש לסגור את התכולה ואת מדיניות הגישה לתכנים עתידיים לפני הפרסום.</DraftNote>
    </div>
  </section>;
}

const collagePositions = ["md:col-span-2 md:row-span-2 md:rotate-[-2deg]", "md:rotate-[3deg] md:-mr-5 md:mt-6", "md:rotate-[-3deg] md:-mr-3", "md:col-span-2 md:col-start-2 md:rotate-[2deg]"];

export function AboutAviSection() {
  const { aviPhotos } = ideaToBusiness;
  return <section id="about-avi" className="bg-stone-50 py-16 md:py-24 text-slate-900 overflow-hidden">
    <div className={wrap}><h2 className={`${heading} text-blue-900 max-w-3xl mx-auto text-center mb-12`}>אני לא מלמד AI מהצד.<br />אני משתמש בו כדי לבנות דברים אמיתיים.</h2>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
        <figure>
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[144px] md:auto-rows-[176px] gap-3 md:gap-4 md:py-5">
            {aviPhotos.map((photo, i) => <div key={photo.src} className={`relative min-w-0 min-h-0 overflow-hidden rounded-2xl md:shadow-md ${collagePositions[i % collagePositions.length]}`}><img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ objectPosition: photo.position }} /></div>)}
          </div>
          <figcaption className="mt-4 text-sm text-slate-600 text-center">מתוך הרצאות וסדנאות בהנחיית אבי</figcaption>
        </figure>
        <div className="space-y-5 text-lg leading-relaxed"><p className="font-bold text-xl">נעים מאוד, אבי פריד, מרצה, יזם ויוצר בתחום ה-AI.</p><p>בשנים האחרונות אני עובד עם בעלי עסקים, צוותים וארגונים על שאלה אחת שחוזרת שוב ושוב:</p><p className="text-xl font-semibold text-blue-900 border-r-4 border-yellow-400 pr-5">איך לוקחים את כל מה ש-AI יודע לעשות והופכים אותו למשהו שבאמת מקדם את העבודה או את העסק?</p><p>אני בעצמי משתמש ב-AI כדי לחקור, לפתח רעיונות, לבנות מוצרים, ליצור דפי נחיתה, לפתח כלים ואפליקציות ולבדוק דרכים חדשות להפוך רעיון למשהו שעובד בעולם האמיתי.</p><p>את הקורס הזה בניתי מתוך אותו תהליך בדיוק.</p><p>לא כדי ללמד אתכם עוד רשימה של כלים, אלא כדי לתת לכם דרך עבודה שתעזור לכם לחשוב, לבנות ולבצע יותר בעצמכם.</p></div>
      </div>
    </div>
  </section>;
}

const feedbackRotation = ["md:rotate-[-1deg]", "md:rotate-[1.5deg]", "md:rotate-[-0.5deg]"];

export function TestimonialsSection() {
  const { testimonials } = ideaToBusiness;
  return <section id="feedback" className="bg-slate-100 py-16 md:py-24 text-slate-900 overflow-hidden">
    <div className={wrap}><h2 className={`${heading} text-blue-900 text-center mb-6`}>אל תיקחו רק את המילה שלי</h2>
      <div className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-3 md:block md:columns-3 lg:columns-4 md:gap-5 md:overflow-visible">
        {testimonials.map((item, i) => <figure key={item.src} className={`w-[78%] shrink-0 snap-center md:w-auto md:break-inside-avoid mb-5 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm ${feedbackRotation[i % feedbackRotation.length]}`}><img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="w-full h-auto rounded-xl" /></figure>)}
      </div>
    </div>
  </section>;
}

export function AvailableLessons() {
  return <div id="available-lessons" className="max-w-4xl mx-auto mb-12 text-white scroll-mt-8">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h3 className="text-2xl font-bold">כבר מחכה לכם בקורס</h3>
    </div>
    <Accordion type="multiple" defaultValue={["available-0"]} dir="rtl" className="border-y border-white/20">
      {availableCourseModules.map((module, i) => <AccordionItem key={module.title} value={`available-${i}`} className="border-white/20">
        <AccordionTrigger className="text-right text-xl gap-4 py-6 font-bold"><span>{module.title} <span className="text-sm text-slate-300 font-medium">({module.lessons.length})</span></span></AccordionTrigger>
        <AccordionContent className="text-lg text-slate-100 leading-relaxed">
          <ul className="space-y-3 pb-3">{module.lessons.map(lesson => <li key={lesson} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 shrink-0 text-green-400 mt-1" aria-hidden="true" />{lesson}</li>)}</ul>
        </AccordionContent>
      </AccordionItem>)}
    </Accordion>
    <div id="upcoming-content" className="mt-16 border-t border-white/20 pt-12 md:pt-16 scroll-mt-8">
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
        <p className="text-yellow-300 font-bold text-xl md:text-2xl mb-3">וזו רק ההתחלה</p>
        <h4 className="text-3xl md:text-4xl font-bold text-balance mb-5">בקרוב: עוד דרכים לבנות ולקדם את העסק</h4>
        <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">ממחקר ותוכן ועד מוצרים חכמים ולקוחות חדשים. עוד יכולות שתוכלו להוסיף לעסק, כחלק מהקורס.</p>
      </div>
      <Accordion type="multiple" defaultValue={["upcoming-0"]} dir="rtl" className="space-y-5">
        {upcomingCourseGroups.map((group, i) => <AccordionItem key={group.title} value={`upcoming-${i}`} className="rounded-2xl border border-white/20 bg-white/[0.04] p-5 md:p-7 grid md:grid-cols-[minmax(0,1fr)_190px] gap-5 md:gap-7 items-start">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-sm font-bold text-yellow-200">בקרוב כחלק מהקורס</span>
            <AccordionTrigger className="text-right text-xl md:text-2xl gap-4 pt-4 pb-3 font-bold hover:no-underline">{group.title}</AccordionTrigger>
            <AccordionContent className="text-lg text-slate-100 leading-relaxed"><ul className="space-y-4 pt-3">{group.items.map(item => <li key={item} className="flex gap-3"><span className="text-yellow-300 shrink-0" aria-hidden="true">＋</span><span>{item}</span></li>)}</ul></AccordionContent>
          </div>
          <aside aria-label={`השוואת עלות: ${group.title}`} className="rounded-xl border border-yellow-200/20 bg-slate-950/30 p-4 text-center">
            <p className="text-sm text-slate-300">דוגמה לעלות אצל איש מקצוע</p>
            <p className="text-base font-semibold text-white mt-2">{group.market.service}</p>
            <p className="text-sm text-yellow-100 mt-4">{group.market.qualifier}</p>
            <p className="text-3xl font-bold text-yellow-300 mt-1"><bdi>₪{group.market.price}</bdi></p>
            <p className="text-sm text-slate-300 mt-1">{group.market.unit}</p>
            <a href={group.market.source} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-slate-300 underline underline-offset-4 mt-3 hover:text-white" aria-label={`מקור המחיר: ${group.market.service}`}>מקור המחיר</a>
          </aside>
        </AccordionItem>)}
      </Accordion>
      <p className="text-sm leading-relaxed text-slate-300 mt-6">המחירים הם דוגמאות לשירותים בהיקף המצוין, לפי מחירוני ספקים. בקורס לומדים לבצע בעצמכם; השירותים אינם כלולים ברכישה. העלות בפועל תלויה בספק ובהיקף העבודה, וייתכנו עלויות לכלים ולמנויים.</p>
    </div>
  </div>;
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
  { q: "מה זמין בקורס כרגע ומה יתווסף בהמשך?", a: "כבר זמינים שיעורי הפתיחה, יסודות העסק, מוצרים והצעה, בניית דף נחיתה, חומרי העזר והבונוס על מוצר דיגיטלי לחדירה לשוק. באזור ״בקרוב״ מוצגים כיווני ההמשך: תוכן שיווקי, קרוסלות, דיוור, CRM, אוטומציות וכלים חכמים. רשימת התכנים העתידיים עדיין בעריכה ואינה זמינה לצפייה. הפירוט מופיע באזור ״מה מקבלים בפועל״." },
  { q: "האם יש גישה לתכנים עתידיים?", todo: "מדיניות הגישה ליחידות עתידיות לרוכשי מחיר ההשקה, כולל השאלה אם תהיה תוספת תשלום. התשובה הסופית טרם נקבעה." },
];

export function FAQSection() {
  return <section id="faq" className="bg-white py-16 md:py-24 text-slate-900"><div className="container mx-auto px-6 max-w-4xl"><h2 className={`${heading} text-blue-900 mb-10`}>לפני שמתחילים, כמה תשובות</h2><Accordion type="single" collapsible dir="rtl">{faqs.map((item, i) => <AccordionItem key={item.q} value={`faq-${i}`} className="border-slate-200"><AccordionTrigger className="text-right text-lg md:text-xl gap-5 py-6">{item.q}</AccordionTrigger><AccordionContent className="text-base md:text-lg leading-relaxed text-slate-600">{item.todo ? <DraftNote>{item.todo}</DraftNote> : item.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>;
}

export function ReviewChecklist() {
  return <aside id="review-items" className="bg-amber-50 text-amber-950 border-y border-amber-200 py-10"><div className={`${wrap} max-w-4xl`}><h2 className="text-xl font-bold mb-5">טיוטה לבדיקה · מה נשאר להשלים לפני פרסום</h2><ul className="grid sm:grid-cols-2 gap-3 text-sm leading-relaxed">{["נוסח CTA סופי", "מחיר מלא עתידי", "מדיניות גישה לעדכונים עתידיים", "נתוני סמכות מאומתים", "החלטה אם להציג את FoodVision", "אישור תוכנית ההרחבות לספרייה המתפתחת"].map(x => <li key={x} className="flex gap-2"><span aria-hidden="true">○</span><span>{x}</span></li>)}</ul></div></aside>;
}
