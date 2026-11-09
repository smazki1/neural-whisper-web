import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { availableCourseModules, ideaToBusiness } from "@/content/ideaToBusiness";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { y: 28, opacity: .15 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? 0 : .75, delay: reduced ? 0 : delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

export function StartingPoint() {
  return <section className="cw-start cw-shell" aria-labelledby="starting-title">
    <Reveal className="cw-start-heading"><span className="cw-kicker">יש עם מה לעבוד</span><h2 id="starting-title">לא חסרים<br />לכם <em>רעיונות.</em></h2></Reveal>
    <Reveal className="cw-start-copy" delay={.1}><p className="cw-lead">לפעמים חסר החיבור בין<br />״יש לי משהו״ ל־״זה מה שאני מציע״.</p><p className="cw-body">יש לכם ניסיון, ידע ואולי גם עסק שכבר עובד. אבל כשמגיע הזמן לפתח הצעה חדשה, השאלות נערמות: מה נכון לבנות, מי צריך את זה ואיפה בכלל מתחילים?</p><p className="cw-body">בקורס עובדים על הרעיון שלכם. חוקרים, מקבלים החלטות ובונים את החלקים שצריך כדי לצאת איתו לשוק.</p></Reveal>
    <div className="cw-question-strip">{["למי זה באמת עוזר?", "מה כדאי להציע?", "מה בונים קודם?"].map((q, i) => <Reveal key={q} delay={i * .12} className={`cw-question cw-question-${i}`}><span>0{i + 1}</span><p>{q}</p><svg viewBox="0 0 160 12" aria-hidden="true"><path d="M3 8 Q90 -2 155 6" /></svg></Reveal>)}</div>
  </section>;
}

const outcomes = [
  { title: "הצעה שאפשר להבין", text: "מוצר או שירות שעונה על צורך ברור, עם פירוט של מה מקבלים ולמי הוא מתאים.", detail: "למי זה עוזר · מה מקבלים", kind: "offer" },
  { title: "מילים ומראה משלכם", text: "ניסוחים וכיוון עיצובי שבחרתם ודייקתם, כדי שיבינו מה אתם מציעים ושירגישו שזה אתם.", detail: "מילים · תמונות · צבעים", kind: "brand" },
  { title: "דף שאפשר לשלוח", text: "עמוד שמחבר את ההצעה, התוכן והעיצוב, ומסביר לאנשים איך ממשיכים.", detail: "מציגים · בודקים · משפרים", kind: "page" },
];

export function Outcomes() {
  return <section className="cw-outcomes"><div className="cw-shell"><div className="cw-section-top"><span className="cw-kicker">מה תוכלו לבנות בקורס</span><span className="cw-edition">YOUR NEXT OFFER</span></div><Reveal className="cw-outcomes-heading"><h2>יש לכם מה להציע.<br /><em>עכשיו אפשר להציג את זה.</em></h2><p className="cw-body">עובדים עם AI על ההצעה שלכם,<br />ועל המילים, המראה והדף שיציגו אותה.</p></Reveal><div className="cw-outcome-grid">{outcomes.map((item, i) => <Reveal className={`cw-outcome cw-outcome-${item.kind}`} key={item.title} delay={i * .12}><div className="cw-outcome-art" aria-hidden="true">{item.kind === "offer" ? <div className="cw-mini-offer"><span>ההצעה שלי</span><strong>בעיה.<br />דרך.<br /><em>ערך.</em></strong><i /></div> : item.kind === "brand" ? <div className="cw-mini-brand"><strong>אבג.</strong><span>הקול של העסק שלכם</span><div><i /><i /><i /></div></div> : <div className="cw-mini-web"><span>הדף שלכם</span><strong>יש לכם<br />מה להציע.</strong><i /><div><b /><b /><b /></div></div>}</div><span className="cw-outcome-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p><small>{item.detail}</small></Reveal>)}</div></div></section>;
}

export function ProductShowcase() {
  const demos = [
    { ...ideaToBusiness.examples[2], title: "מחירון והצעות מחיר", caption: "מציגים את השירותים והמחירים בעיצוב של העסק." },
    { ...ideaToBusiness.examples[1], title: "קרוסלות לרשתות החברתיות", caption: "כותבים ומעצבים סדרת שקפים מתוך רעיון לפוסט." },
    { ...ideaToBusiness.examples[3], title: "תמונות מוצר", caption: "מעלים תמונת מוצר ובוחרים לה רקע ואווירה." },
  ];
  const [selected, setSelected] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const demo = demos[selected];
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.current?.pause(); });
    if (wrapper.current) observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);
  return <section className="cw-showcase" id="examples" aria-labelledby="showcase-title"><div className="cw-shell">

    <Reveal className="cw-showcase-heading"><h2 id="showcase-title">מתוך העבודה שלי<br /><em>עם AI</em></h2><p className="cw-body">הנה שלושה כלים שבניתי עם AI למשימות בעסק. לחצו כדי לראות אותם בפעולה.</p></Reveal>
    <div className="cw-showcase-layout"><div className="cw-demo-menu" aria-label="בחירת הדגמה">{demos.map((item, i) => <button key={item.src} aria-pressed={selected === i} onClick={() => { setSelected(i); setLoaded(false); }}><span className="cw-demo-index">0{i + 1}</span><span><strong>{item.title}</strong>{selected === i && <small>{item.caption}</small>}</span><span className="cw-demo-arrow" aria-hidden="true">↖</span></button>)}<p className="cw-demo-note">הכלים כאן הם דוגמאות מהעבודה שלי. השיעורים על בניית כלים ואפליקציות יתווספו בהמשך, ואינם זמינים כרגע.<br /><a href="#course-curriculum">לשיעורים שכבר זמינים בקורס ↙</a></p></div>
      <div ref={wrapper} className="cw-demo-player"><div className="cw-demo-window"><div className="cw-browser-chrome"><i /><i /><i /><span>מתוך שולחן העבודה של אבי</span></div><div className="cw-demo-screen">{loaded ? <video key={demo.src} ref={video} src={demo.src} poster={demo.poster} autoPlay muted playsInline controls preload="metadata" aria-label={`הדגמה: ${demo.title}`} /> : <button className="cw-play-demo" onClick={() => setLoaded(true)} aria-label={`הפעלת הדגמה: ${demo.title}`}><img src={demo.poster.replace("-poster-start", "-poster")} alt={demo.alt} width="1280" height="720" loading="lazy" /><span><i aria-hidden="true">▷</i>לצפייה בהדגמה</span></button>}</div></div></div>
    </div>
  </div></section>;
}

const courseUnitCopy = [
  { title: "מתחילים לעבוד עם AI", description: "מכירים את סביבת העבודה ואת דרך העבודה בקורס." },
  { title: "מחדדים את העסק", description: "עובדים על הכיוון, הבנת הלקוחות, המילים והמראה." },
  { title: "מפתחים את ההצעה", description: "בוחנים אפשרויות ומגבשים מוצר או שירות שאפשר להציג." },
  { title: "בונים את דף הנחיתה", description: "מחברים את ההצעה, התוכן והעיצוב לדף." },
];

export function CourseContents() {
  const lessonCount = availableCourseModules.reduce((sum, group) => sum + group.lessons.length, 0);
  return <section className="cw-course cw-shell" id="course-curriculum" aria-labelledby="course-title">
    <div className="cw-section-top"><span className="cw-kicker">תוכנית הקורס</span></div>
    <div className="cw-course-layout">
      <Reveal className="cw-course-intro">
        <h2 id="course-title">מה לומדים<br /><em>בקורס?</em></h2>

        <div className="cw-course-facts"><span><b>{lessonCount}</b>שיעורים מוקלטים בעברית</span><span><b>{availableCourseModules.length}</b>יחידות לימוד</span></div>

        <a className="cw-text-button" href="#enroll">לפרטי ההצטרפות <span>↙</span></a>
      </Reveal>
      <div className="cw-course-folder">
        <span className="cw-folder-tab">השיעורים הזמינים עכשיו</span>
        {availableCourseModules.map((group, i) => <details key={group.title} open={i === 0}>
          <summary><span className="cw-module-index">0{i + 1}</span><strong>{courseUnitCopy[i]?.title ?? group.title}</strong><small>{group.lessons.length} שיעורים</small><span className="cw-details-plus" aria-hidden="true">+</span></summary>

          <ul>{group.lessons.map((lesson, lessonIndex) => <li key={lesson}>{i === 1 && lessonIndex === 0 ? "במה כדאי להתמקד בעסק" : lesson}</li>)}</ul>
        </details>)}

      </div>
    </div>
  </section>;
}

export function RealWorkPreview() {
  return <ProductShowcase />;
}

export function AboutAndProof() {
  const photos = ideaToBusiness.aviPhotos;
  return <>
    <section className="cw-about" id="about-avi">
      <div className="cw-shell cw-about-layout">
        <div className="cw-about-photos cw-about-photos-trio">
          <Reveal className="cw-avi-main"><img src={photos[0].preview} alt={photos[0].alt} loading="lazy" width={800} height={1067} /></Reveal>
          <Reveal className="cw-avi-lecture" delay={.1}><img src={photos[1].preview} alt={photos[1].alt} loading="lazy" width={900} height={600} /></Reveal>
          <Reveal className="cw-avi-small" delay={.2}><img src={photos[2].preview} alt={photos[2].alt} loading="lazy" width={600} height={800} /><span className="paper-tape" /></Reveal>

        </div>
        <Reveal className="cw-about-copy">

          <h2>נעים מאוד,<br /><em>אני אבי.</em></h2>
          <p className="cw-body">בתחילת הדרך שלי כבעל עסק ידעתי שיש לי הרבה מה לתת. מה שלא ידעתי היה איך להפוך את זה למוצר או לשירות שאנשים ירצו לקנות, ולמה שיבחרו דווקא בי.</p>
          <p className="cw-body">השקעתי שנים בלמידה, ביועצים ובקורסים כדי להבין איך בונים עסק סביב הידע והיכולות שלי. היום, כשאני רואה מה אפשר לעשות עם AI, אני חושב כמה הייתי רוצה שתהיה לי האפשרות הזאת כשהתחלתי.</p>
          <p className="cw-body"><strong>זה מה שאני רוצה לאפשר גם לבעלי עסקים אחרים: לעשות בעצמם דברים שעד היום נראו רחוקים, מסובכים או יקרים מדי.</strong></p>
          <p className="cw-body">בקורס חיברתי את מה שלמדתי לאורך הדרך לעבודה עם AI. כדי שתוכלו לקחת רעיון שאתם מאמינים בו, לפתח אותו ולהגיע עם משהו ממשי ללקוחות.</p>

          <span className="cw-signature">אבי פריד <svg viewBox="0 0 150 20" aria-hidden="true"><path d="M4 15 Q70 1 145 6" /></svg></span>
        </Reveal>
      </div>
    </section>
    <section className="cw-proof cw-shell" id="feedback">

      <Reveal className="cw-proof-heading"><h2>מה אומרים<br /><em>מי שלמדו איתי?</em></h2></Reveal>
      <div className="cw-testimonials">{ideaToBusiness.testimonials.slice(0, 3).map((item, i) => <Reveal key={item.src} className={`cw-testimonial cw-testimonial-${i}`} delay={i * .1}><span className="paper-tape" /><a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`פתיחת עדות ${i + 1} בגודל מלא`}><img src={item.preview} alt={item.alt} loading="lazy" width={item.width} height={item.height} /></a></Reveal>)}</div>
      <details className="cw-more-proof"><summary>עוד הודעות ממשתתפים <span aria-hidden="true">+</span></summary><div>{ideaToBusiness.testimonials.slice(3).map(item => <a key={item.src} href={item.src} target="_blank" rel="noopener noreferrer"><img src={item.preview} alt={item.alt} loading="lazy" width={item.width} height={item.height} /></a>)}</div></details>
    </section>
  </>;
}

export function FitAndLearning() {
  return <section className="cw-fit"><div className="cw-shell">
    <Reveal className="cw-fit-intro"><h2>לומדים בקצב שלכם.<br /><em>עובדים על העסק שלכם.</em></h2><p className="cw-body">צופים בהדגמה, עוצרים כדי לנסות על הרעיון שלכם וחוזרים להסבר כשצריך. כדי להתקדם, צריך לפנות זמן גם לעבודה בין השיעורים.</p></Reveal>
    <div className="cw-fit-columns">
      <Reveal><h3>מה תרצו לקדם?</h3><ul><li>יש לכם ידע או ניסיון, ואתם רוצים לפתח מהם מוצר או שירות.</li><li>כבר יש לכם עסק, ואתם רוצים לחדד את ההצעה ולבנות לה דף נחיתה.</li><li>אתם רוצים להוסיף לעסק מוצר, שירות או סדנה.</li></ul></Reveal>
      <Reveal delay={.1}><h3>איך זה עובד?</h3><ol>
        <li><span>01</span><div><strong>רואים איך עושים את זה</strong><p>שיעורים מוקלטים בעברית, עם הדגמות על המסך.</p></div></li>
        <li><span>02</span><div><strong>עובדים על הדבר שלכם</strong><p>משתמשים בהנחיות ובגיליונות העבודה כדי לפתח את הרעיון, לבדוק את התוצאות ולשפר אותן.</p></div></li>
        <li><span>03</span><div><strong>שואלים כשצריך</strong><p>קבוצת WhatsApp לתמיכה במהלך הלמידה.</p></div></li>
      </ol></Reveal>
    </div>
  </div></section>;
}

const faqs = [
  ["יש לי רק רעיון. אפשר להתחיל?", "כן. לא צריך להגיע עם מוצר מוכן. מתחילים מהרעיון או מהידע שלכם ובודקים למי הם יכולים לעזור ומה אפשר להציע."],
  ["כבר יש לי עסק. מה אעשה בקורס?", "אפשר לעבוד על שירות שכבר קיים, לפתח מוצר נוסף או לבנות דף נחיתה לעסק."],
  ["אני בתחילת הדרך עם AI. זה מתאים?", "כן. מתחילים בהיכרות עם סביבת העבודה, ואת השלבים אני מדגים על המסך. אפשר לעצור ולחזור על כל שיעור."],
  ["איך לומדים ומקבלים עזרה?", "השיעורים מוקלטים, הגישה לקורס היא לכל החיים, ויש קבוצת WhatsApp לתמיכה."],
];

export function Questions() {
  return <section className="cw-faq cw-shell" id="questions"><div><h2>לפני<br /><em>שמצטרפים</em></h2></div><div>{faqs.map(([q, a]) => <details key={q}><summary>{q}<span className="cw-details-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>;
}
