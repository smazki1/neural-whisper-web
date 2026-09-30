import { LandingImage } from "./LandingImage";
import { HoverDemo } from "./HoverDemo";
import { KnowledgeTakesShape } from "./KnowledgeTakesShape";
import { TimeToProgress } from "./TimeToProgress";
import { CheckCircle, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const heroBackground03 = "/images/idea-to-business/optimized/landing-background-03.webp";
import { availableCourseModules, upcomingCourseGroups, ideaToBusiness } from "@/content/ideaToBusiness";
import { motion, useReducedMotion } from "framer-motion";

const wrap = "landing-shell container mx-auto px-6 max-w-6xl font-medium";
const heading = "text-3xl md:text-4xl font-bold leading-tight text-balance";

export function SolutionSection() {
  const reducedMotion = useReducedMotion();
  const initial = reducedMotion ? false : { opacity: 0, y: 24 };
  const visible = { opacity: 1, y: 0 };

  return <section id="course-solution" className="landing-responsive bg-slate-900 py-16 md:py-24 text-white">
    <div className={`${wrap} grid gap-9 md:gap-12 lg:gap-20 md:grid-cols-[1fr_1.05fr] md:items-start`}>
      <motion.div initial={initial} whileInView={visible} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.65 }}>
        <p className="text-lg text-yellow-300 font-bold mb-4">מרעיון למוצר שאפשר להתחיל למכור</p>
        <h2 className="max-w-lg text-3xl lg:text-4xl font-bold text-balance">דרך עבודה שחוזרים אליה, בכל פעם שעולה רעיון חדש.</h2>
        <p className="mt-6 lg:mt-8 text-xl leading-relaxed text-yellow-300 font-bold">יותר יכולת להחליט.<br />יותר יכולת לבנות בעצמכם.</p>
      </motion.div>
      <motion.div className="hidden md:block space-y-6 text-lg lg:text-xl text-slate-200 font-medium leading-[1.8]" initial={initial} whileInView={visible} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : 0.12 }}>
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
  return <section id="possibilities" className="landing-responsive relative bg-gradient-to-br from-blue-950 via-purple-900 to-slate-900 py-16 md:py-20 text-white">
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
  return <section id="building-products" className="landing-responsive border-t border-white/10 bg-slate-900 py-16 md:py-24 text-slate-200">
    <div className={`${wrap} grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center`}>
      <div><h2 className={`${heading} text-white mb-8`}>ולפעמים, הדבר שאתם בונים הוא המוצר עצמו</h2><div className="text-xl md:text-2xl leading-relaxed space-y-6"><p>AI לא רק עוזר לכם לשווק מהר יותר.</p><p>בעזרת Vibe Coding אפשר לקחת רעיון שהיה נשאר פעם במחברת ולהתחיל להפוך אותו לכלי אמיתי שאנשים יכולים להשתמש בו.</p></div></div>
      <div className="w-full max-w-[502px] min-w-0 rounded-2xl bg-slate-900 text-white"><KnowledgeTakesShape /></div>
    </div>
  </section>;
}

export function OutputsSection() {
  return <section id="examples" className="landing-responsive bg-slate-100 py-16 md:py-24 text-slate-900">
    <div className={wrap}>
      <h2 className={`${heading} text-blue-900 text-center mb-10 md:mb-14`}>מעולם לא היה קל יותר להפוך את הרעיון שלכם לאפליקציה</h2>
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
    <img src={heroBackground03} loading="lazy" decoding="async" width={1392} height={752} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
    {kind === "content" ? <div className="future-content-stack">{[0, 1, 2].map(n => <div className="future-content-sheet" key={n}><span /><i /><i /><b /></div>)}</div>
      : kind === "crm" ? <div className="future-crm-board">{[0, 1, 2].map(n => <div key={n}><span />{[0, 1, 2].slice(0, n === 1 ? 2 : 3).map(k => <i key={k} />)}</div>)}</div>
      : <div className="future-tool-window"><div className="flex gap-1.5 mb-5"><i /><i /><i /></div><Sparkles className="h-9 w-9 text-violet-200 mx-auto mb-4" /><span className="future-tool-input" /><span className="future-tool-result" /></div>}
  </div>;
}

export function LibrarySection() {
  return <section id="growing-library" className="landing-responsive bg-slate-900 py-16 md:py-24 text-white">
    <div className={wrap}>
      <div className="max-w-3xl mx-auto text-center mb-10"><h2 className={`${heading} mb-6`}>והקורס ממשיך להתפתח יחד עם הדרך שבה AI משנה את העסק</h2><p className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-100">״מרעיון לעסק״ הוא לא קורס שבניתי פעם אחת והשארתי כמו שהוא.</p><p className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-100 mt-5">אני ממשיך להוסיף אליו שיעורים פרקטיים מתוך הדברים שאני בעצמי בונה, בודק ומשתמש בהם בעבודה.</p></div>

    </div>
  </section>;
}

export function UpcomingLibraryCards() {
  return <div className="upcoming-library hidden md:block mx-auto mb-12 max-w-[1104px] font-medium text-white">
      <div className="grid gap-6 lg:grid-cols-3">{library.map(item => <article key={item.title} className="future-library-card rounded-2xl border border-white/15 bg-white/[0.04] overflow-hidden">
        <div className="relative"><ComingSoonArt kind={item.kind} /><span className="coming-soon-badge"><Sparkles className="h-4 w-4" aria-hidden="true" />בקרוב</span></div>
        <div className="p-6 text-center"><h3 className="text-2xl font-bold mb-4">{item.title}</h3><p className="text-slate-200 text-lg leading-relaxed">{item.text}</p></div>
      </article>)}</div>
  </div>;
}

const audiencePositions = ["50% 82%", "50% 50%", "50% 68%", "50% 50%", "50% 70%"];

export function AboutAviSection() {
  const { aviPhotos } = ideaToBusiness;
  return <section id="about-avi" className="bg-stone-50 py-16 md:py-24 text-slate-900">
    <div className="audience-shell">
      <h2 className={`${heading} text-blue-900 max-w-3xl mx-auto text-center mb-12`}><span className="block">אני לא מלמד AI.</span><span className="block mx-auto max-w-2xl text-balance">אני מלמד אנשים לבנות איתו דברים שפעם לא היו אפשריים.</span></h2>
      <div className="audience-intro">
        <div className="audience-copy space-y-5 text-lg leading-relaxed"><p className="font-bold text-xl">נעים מאוד, אבי פריד, מרצה, יזם ויוצר בתחום ה-AI.</p><p>בשנים האחרונות אני עובד עם בעלי עסקים, צוותים וארגונים על שאלה אחת שחוזרת שוב ושוב:</p><p className="text-xl font-semibold text-blue-900 border-r-4 border-yellow-400 pr-5">איך לוקחים את כל מה ש-AI יודע לעשות והופכים אותו למשהו שבאמת מקדם את העבודה או את העסק?</p><p className="hidden md:block">אני בעצמי משתמש ב-AI כדי לחקור, לפתח רעיונות, לבנות מוצרים, ליצור דפי נחיתה, לפתח כלים ואפליקציות ולבדוק דרכים חדשות להפוך רעיון למשהו שעובד בעולם האמיתי.</p><p className="hidden md:block">את הקורס הזה בניתי מתוך אותו תהליך בדיוק.</p><p className="hidden md:block">לא כדי ללמד אתכם עוד רשימה של כלים, אלא כדי לתת לכם דרך עבודה שתעזור לכם לחשוב, לבנות ולבצע יותר בעצמכם.</p></div>
        <figure className="audience-main-photo">
          <LandingImage src={aviPhotos[0].preview} srcSet={aviPhotos[0].srcSet} sizes="(min-width: 1456px) 787px, (min-width: 1024px) 57vw, calc(100vw - 32px)" width={aviPhotos[0].width} height={aviPhotos[0].height} alt={aviPhotos[0].alt} loading="lazy" decoding="async" style={{ objectPosition: audiencePositions[0] }} />
        </figure>
      </div>
      <div className="audience-gallery">
        {aviPhotos.slice(1).map((photo, i) => <figure key={photo.src}>
          <LandingImage src={photo.preview} srcSet={photo.srcSet} sizes="(min-width: 1456px) 668px, (min-width: 640px) 46vw, calc(100vw - 32px)" width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" style={{ objectPosition: audiencePositions[i + 1] }} />
        </figure>)}
      </div>
    </div>
  </section>;
}

export function TestimonialsSection() {
  const { testimonials } = ideaToBusiness;
  return <section id="feedback" className="landing-responsive bg-slate-100 py-16 md:py-24 text-slate-900">
    <div className="audience-shell">
      <h2 className={`${heading} text-blue-900 text-center mb-10`}>אל תיקחו רק את המילה שלי</h2>
      <div className="testimonials-gallery">
        {testimonials.map((item, i) => <figure key={item.src}>
          <a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`פתיחת עדות ${i + 1} בגודל מלא בחלון חדש`}>
            <LandingImage src={item.preview} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
          </a>
        </figure>)}
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
      </div>
      <div dir="rtl" className="space-y-5">
        {upcomingCourseGroups.map(group => <article key={group.title} className="rounded-2xl border border-white/20 bg-white/[0.04] p-5 md:p-7 grid md:grid-cols-[minmax(0,1fr)_190px] gap-5 md:gap-7 items-start">
          <div className="min-w-0">
            <h5 className="text-right text-xl md:text-2xl mb-5 font-bold">{group.title}</h5>
            <ul className="space-y-4 text-lg text-slate-100 leading-relaxed">{group.items.map(item => <li key={item} className="flex gap-3"><span className="text-yellow-300 shrink-0" aria-hidden="true">＋</span><span>{item}</span></li>)}</ul>
          </div>
          <aside aria-label={`עלות הבונוס: ${group.title}`} className="px-5 py-6 text-center md:self-center">
            <p className="text-base font-semibold text-yellow-100 mb-2">עלות הבונוס</p>
            <p className="text-3xl md:text-4xl font-bold text-yellow-300"><bdi>₪{group.bonusPrice}</bdi></p>
          </aside>
        </article>)}
      </div>
    </div>
  </div>;
}

export function TimeSection() {
  return <section id="time" aria-labelledby="time-heading" className="landing-responsive bg-white py-16 md:py-24">
    <div className={wrap}>
      <TimeToProgress />
    </div>
  </section>;
}

const faqs = [
  { q: "צריך כבר עסק קיים?", a: "לא. אפשר להגיע עם ידע, ניסיון או רעיון שרוצים לפתח. הקורס מתאים גם לבעלי עסקים שרוצים לחדד מוצר קיים או לבנות מוצר חדש." },
  { q: "צריך לדעת לעבוד עם AI?", a: "צריך ידע בסיסי במחשב ובדפדפן וחשבון ChatGPT. אפשר להתחיל בחשבון חינמי. לאורך הקורס עובדים על הרעיון או העסק שלכם בעזרת הדגמות והנחיות." },
  { q: "אני לא טכנולוגי, זה בשבילי?", a: "לא צריך ניסיון בכתיבת קוד. כן צריך נכונות להתנסות, ללמוד ולבדוק את מה שבונים. AI עוזר בתהליך, ואתם מקבלים את ההחלטות." },
  { q: "כמה זמן צריך להשקיע?", a: "זהו קורס מוקלט ללמידה בקצב שלכם. היישום דורש זמן ועבודה, בהתאם לרעיון ולמה שתרצו לבנות. אפשר להתקדם שלב אחר שלב; אין כאן הבטחה לעסק מוכן בלחיצת כפתור." },
  { q: "יש לי כבר עסק ואתר, האם הקורס עדיין רלוונטי?", a: "כן. אפשר לעבוד על מוצר חדש, לחדד הצעה קיימת או לפתח כלי שיעזור לעסק. אין צורך להתחיל את העסק מחדש." },
  { q: "מה זמין בקורס כרגע ומה יתווסף בהמשך?", a: "כבר זמינים שיעורי הפתיחה, יסודות העסק, מוצרים והצעה, בניית דף נחיתה, חומרי העזר והבונוס על מוצר דיגיטלי לחדירה לשוק. באזור ״בקרוב״ מוצגים כיווני ההמשך: תוכן שיווקי, קרוסלות, דיוור, CRM, אוטומציות וכלים חכמים. התכנים העתידיים יתווספו בהמשך. הפירוט מופיע באזור ״מה מקבלים בפועל״." },
  { q: "האם יש גישה לתכנים עתידיים?", a: "כן. גם מי שרוכשים את הקורס במחיר ההשקה יקבלו גישה לתכנים חדשים שיתווספו לקורס בהמשך." },
];

export function FAQSection() {
  return <section id="faq" className="landing-responsive bg-white py-16 md:py-24 text-slate-900"><div className="container mx-auto px-6 max-w-4xl"><h2 className={`${heading} text-blue-900 mb-10`}>לפני שמתחילים, כמה תשובות</h2><Accordion type="single" collapsible dir="rtl">{faqs.map((item, i) => <AccordionItem key={item.q} value={`faq-${i}`} className="border-slate-200"><AccordionTrigger className="text-right text-lg md:text-xl gap-5 py-6">{item.q}</AccordionTrigger><AccordionContent className="text-base md:text-lg leading-relaxed text-slate-600">{item.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>;
}
