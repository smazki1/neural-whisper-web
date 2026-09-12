import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCopy,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* טיפוסים ועזרים מקומיים — הכל מקומי לעמוד ההדגמה הזה                 */
/* ------------------------------------------------------------------ */

type Preference = "people" | "self" | "both";
type TimeBudget = "upto2" | "3to5" | "6plus";
type SoldBefore = "yes" | "no";

interface Answers {
  expertise: string;
  helpWith: string;
  story: string;
  noStory: boolean;
  audience: string;
  soldBefore: SoldBefore | "";
  time: TimeBudget | "";
  preference: Preference | "";
}

interface Idea {
  id: string;
  format: "service" | "kit" | "workshop";
  name: string;
  deliverable: string;
  forWhom: string;
  problem: string;
  whyYou: string;
  firstVersion: string;
  assumption: string;
  weeklyAction: string;
  audienceUnclear: boolean;
}

const STORAGE_KEY = "aim-demo-knowledge-to-product-v1";

const EMPTY: Answers = {
  expertise: "",
  helpWith: "",
  story: "",
  noStory: false,
  audience: "",
  soldBefore: "",
  time: "",
  preference: "",
};

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** מחלץ ניסוח קצר ואמיתי מתוך טקסט שהמשתמש כתב */
function phrase(text: string, maxWords = 7): string {
  const first = clean(text).split(/[.,;!?\n]/).find((p) => clean(p).length > 2) || clean(text);
  const words = clean(first).split(" ").filter(Boolean);
  const trimmed = words.slice(0, maxWords).join(" ");
  return trimmed.replace(/^(אני |אנחנו |אני עוסק ב|עוסקת ב|עוסק ב)/, "");
}

function quote(text: string, maxWords = 12): string {
  const words = clean(text).split(" ").filter(Boolean);
  return words.slice(0, maxWords).join(" ") + (words.length > maxWords ? "…" : "");
}

const timeScope: Record<TimeBudget, string> = {
  upto2: "עד שעתיים בשבוע",
  "3to5": "3–5 שעות בשבוע",
  "6plus": "6 שעות ומעלה בשבוע",
};

function buildIdeas(a: Answers, tweak = ""): Idea[] {
  const topic = phrase(a.expertise, 5) || "התחום שלכם";
  const help = phrase(a.helpWith, 6) || "הדבר שמבקשים מכם";
  const caseText = clean(a.story);
  const audienceRaw = clean(a.audience);
  const audienceUnclear =
    !audienceRaw || /עדיין לא ברור|לא ברור|לא יודע|לא יודעת/.test(audienceRaw);
  const audience = audienceUnclear ? `אנשים שמתמודדים עם ${help}` : phrase(a.audience, 8);
  const tweakPhrase = clean(tweak) ? phrase(tweak, 5) : "";
  const suffix = tweakPhrase ? ` · ${tweakPhrase}` : "";
  const time = (a.time || "3to5") as TimeBudget;

  const problem = caseText
    ? `מה שתיארתם: ${quote(caseText, 14)}`
    : `הקושי החוזר סביב ${help}`;

  const smallScope =
    time === "upto2"
      ? "מפגש אחד או תוצר בודד, בלי מערכת מסובכת"
      : time === "3to5"
      ? "שני מפגשים או תוצר אחד עם ליווי קצר"
      : "מסלול קצר של שלושה מפגשים עם חומרי עזר";

  const service: Idea = {
    id: "service",
    format: "service",
    name: `${tweakPhrase ? `${tweakPhrase}: ` : ""}ליווי ממוקד ל${help}`,
    deliverable: `פגישת עבודה אחת ומסמך פעולה קצר שמסדר בדיוק את ${help}.`,
    forWhom: audience,
    problem,
    whyYou: `כתבתם: "${quote(a.helpWith, 12)}" — זה בדיוק התוצר שאנשים מבקשים מכם${suffix}.`,
    firstVersion: `${smallScope}. להציע ל־3 אנשים מהסביבה שלכם, לתמחור התחלתי אחד וקבוע.`,
    assumption: "האם אנשים מוכנים לשלם על התוצר הזה כשהוא מוגדר ומוגבל בזמן.",
    weeklyAction: "לשלוח הצעה קצרה לשלושה אנשים שכבר ביקשו מכם עזרה בעבר.",
    audienceUnclear,
  };

  const kit: Idea = {
    id: "kit",
    format: "kit",
    name: `${tweakPhrase ? `${tweakPhrase} · ` : ""}ערכת עבודה עצמאית ל${topic}`,
    deliverable: `תבנית או צ'ק־ליסט שאפשר למלא לבד ולהגיע לתוצאה בלי פגישה איתכם.`,
    forWhom: audience,
    problem: problem,
    whyYou: `הידע שתיארתם — "${quote(a.expertise, 12)}" — מתאים להפיכה לצעדים חוזרים${suffix}.`,
    firstVersion:
      time === "upto2"
        ? "מסמך אחד של עד שני עמודים, נשלח במייל בלי מערכת."
        : "מסמך עבודה קצר עם דוגמה ממולאת וסרטון הסבר של כמה דקות.",
    assumption: "האם אנשים מצליחים להשתמש בתבנית בלי הסבר אישי שלכם.",
    weeklyAction: "לתת את הגרסה הראשונה לשני אנשים ולראות איפה הם נתקעים.",
    audienceUnclear,
  };

  const workshop: Idea = {
    id: "workshop",
    format: "workshop",
    name: `${tweakPhrase ? `${tweakPhrase} · ` : ""}מפגש אבחון קטן בנושא ${help}`,
    deliverable: `מפגש קבוצתי קצר שבסופו כל משתתף יוצא עם אבחון ושלב אחד ליישום.`,
    forWhom: audienceUnclear ? `${audience} — קבוצה ראשונה קטנה` : audience,
    problem,
    whyYou: `${caseText ? `הסיפור שכתבתם ("${quote(caseText, 10)}") ` : `הדרך שבה אתם מסבירים ${help} `}עובד טוב גם מול כמה אנשים יחד${suffix}.`,
    firstVersion:
      time === "6plus"
        ? "מפגש פיילוט של 90 דקות עד 8 משתתפים, במחיר סמלי."
        : "מפגש פיילוט של 60 דקות עד 5 משתתפים, במחיר סמלי.",
    assumption: "האם מספיק אנשים פנויים להגיע למפגש באותו זמן.",
    weeklyAction: "לקבוע תאריך אחד ולהזמין אליו חמישה אנשים בהודעה אישית.",
    audienceUnclear,
  };

  const pref = a.preference || "both";
  let picked: Idea[];
  if (pref === "people") picked = [service, workshop, { ...kit, name: `${kit.name} (נלווה לליווי)` }];
  else if (pref === "self") picked = [kit, { ...service, name: `בדיקה מודרכת ל${help}` }, { ...workshop, format: "workshop", name: `מפגש הדרכה חד־פעמי ל${topic}` }];
  else picked = [service, kit, workshop];

  if (pref === "people") picked = [service, workshop];
  if (pref === "self") picked = [kit, { ...service, name: `בדיקה מודרכת ל${help}`, deliverable: `סקירה קצרה של המצב הקיים והמלצות כתובות, בלי ליווי מתמשך.` }];

  // תמיד שלושה כרטיסים כשהעדפה פתוחה; אחרת נשלים בגרסה נוספת של הפורמט המתאים
  if (picked.length < 3) {
    if (pref === "people") {
      picked = [
        service,
        workshop,
        {
          ...service,
          id: "service-2",
          name: `מסלול קצר של שתי פגישות ל${topic}`,
          deliverable: "שתי פגישות: אחת לאבחון ואחת לבדיקת היישום.",
          firstVersion: `${smallScope}. להריץ עם שני אנשים בלבד.`,
          weeklyAction: "לבחור שני אנשים ולהציע להם את המסלול הקצר.",
        },
      ];
    } else {
      picked = [
        kit,
        picked[1],
        {
          ...kit,
          id: "kit-2",
          name: `מדריך צעד־אחר־צעד ל${help}`,
          deliverable: "מדריך קצר שמוביל מהמצב ההתחלתי לתוצאה אחת מוגדרת.",
          firstVersion: "פרק אחד בלבד, שנשלח כקובץ.",
          weeklyAction: "לכתוב את הפרק הראשון ולשלוח אותו לשני אנשים.",
        },
      ];
    }
  }

  return picked.slice(0, 3).map((idea, i) => ({ ...idea, id: `${idea.id}-${i}` }));
}

/* ------------------------------------------------------------------ */

const QUESTIONS = 5;

export default function KnowledgeToProductDemo() {
  const [stage, setStage] = useState<"intro" | "quiz" | "summary" | "loading" | "ideas" | "product">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [errors, setErrors] = useState<string>("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selected, setSelected] = useState<Idea | null>(null);
  const [tweak, setTweak] = useState("");
  const [editName, setEditName] = useState("");
  const [editAudience, setEditAudience] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  

  /* שחזור מ-localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.answers) setAnswers({ ...EMPTY, ...parsed.answers });
      if (typeof parsed?.step === "number") setStep(Math.min(parsed.step, QUESTIONS - 1));
      if (parsed?.answers?.expertise) setStage("quiz");
    } catch {
      /* מתעלמים בשקט */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, step, savedAt: new Date().toISOString() })
      );
    } catch {
      /* מתעלמים בשקט */
    }
  }, [answers, step]);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [k]: v }));

  const validateStep = (): boolean => {
    const min = (s: string) => clean(s).length >= 8;
    if (step === 0 && !min(answers.expertise)) return fail("כתבו לפחות משפט קצר על התחום או הניסיון שלכם.");
    if (step === 1 && !min(answers.helpWith)) return fail("כתבו דוגמה קונקרטית אחת למה שמבקשים מכם.");
    if (step === 2 && !answers.noStory && !min(answers.story)) return fail("כתבו כמה מילים, או סמנו שאין דוגמה כרגע.");
    if (step === 2 && answers.noStory && !min(answers.story)) return fail("כתבו משימה אחת שאתם יודעים לבצע היטב.");
    if (step === 3 && !min(answers.audience)) return fail("אפשר גם לכתוב ‘עדיין לא ברור לי’.");
    if (step === 4 && (!answers.soldBefore || !answers.time || !answers.preference))
      return fail("בחרו תשובה בכל שלוש הקבוצות.");
    setErrors("");
    return true;
  };

  const fail = (msg: string) => {
    setErrors(msg);
    return false;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === QUESTIONS - 1) setStage("summary");
    else setStep(step + 1);
  };

  const back = () => {
    setErrors("");
    if (step === 0) setStage("intro");
    else setStep(step - 1);
  };

  const showIdeas = (tweakText = "") => {
    setStage("loading");
    window.setTimeout(() => {
      setIdeas(buildIdeas(answers, tweakText));
      setStage("ideas");
    }, 900);
  };

  const pick = (idea: Idea) => {
    setSelected(idea);
    setEditName(idea.name);
    setEditAudience(idea.forWhom);
    setCopied(false);
    setCopyError("");
    setStage("product");
  };

  const productText = useMemo(() => {
    if (!selected) return "";
    return [
      `כרטיס מוצר — ${editName}`,
      `תיאור: ${selected.deliverable}`,
      `הלקוח הראשון לבדיקה: ${editAudience}`,
      `הבעיה: ${selected.problem}`,
      `למה זה מתאים לי: ${selected.whyYou}`,
      `הגרסה הראשונה: ${selected.firstVersion}`,
      `מה משאירים להמשך: תמחור מלא, שיווק רחב וכל תוספת שלא נדרשת לבדיקה הראשונה.`,
      `ההנחה החשובה לבדיקה: ${selected.assumption}`,
      `פעולה אחת לשבוע הקרוב: ${selected.weeklyAction}`,
      "",
      "AI Master | אבי פריד",
    ].join("\n");
  }, [selected, editName, editAudience]);

  const copyCard = async () => {
    setCopyError("");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(productText);
      } else {
        const ta = document.createElement("textarea");
        ta.value = productText;
        ta.setAttribute("readonly", "true");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("copy failed");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      setCopyError("ההעתקה לא הצליחה. אפשר לסמן את הטקסט ולהעתיק ידנית.");
    }
  };

  const saveLocal = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          answers,
          step,
          selectedIdea: selected ? { ...selected, name: editName, forWhom: editAudience } : null,
          lead: { name: leadName, email: leadEmail, optIn },
          savedAt: new Date().toISOString(),
        })
      );
      const check = localStorage.getItem(STORAGE_KEY);
      if (!check) throw new Error("no write");
      setSavedMsg("נשמר במכשיר הזה.");
      window.setTimeout(() => setSavedMsg(""), 5000);
    } catch {
      setSavedMsg("השמירה לא הצליחה בדפדפן הזה.");
    }
  };

  const resetAll = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* מתעלמים */
    }
    setAnswers(EMPTY);
    setStep(0);
    setIdeas([]);
    setSelected(null);
    setTweak("");
    setConfirmReset(false);
    setStage("intro");
  };

  /* ---------------------------- עיצוב ---------------------------- */
  const shell =
    "min-h-screen w-full bg-[#FBF7EF] text-[#26221D] antialiased selection:bg-[#4B2E70]/15";
  const card = "rounded-2xl border border-[#26221D]/10 bg-white/80 shadow-[0_1px_2px_rgba(38,34,29,0.04),0_12px_28px_-24px_rgba(38,34,29,0.35)]";
  const primaryBtn =
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#4B2E70] px-6 py-3 text-base font-medium text-[#FBF7EF] transition-colors hover:bg-[#3C2459] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B2E70] disabled:cursor-not-allowed disabled:opacity-45";
  const ghostBtn =
    "inline-flex items-center justify-center gap-2 rounded-full border border-[#26221D]/20 px-5 py-3 text-base text-[#26221D] transition-colors hover:bg-[#26221D]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B2E70]";
  const field =
    "w-full rounded-xl border border-[#26221D]/15 bg-white px-4 py-3 text-base leading-relaxed text-[#26221D] placeholder:text-[#26221D]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B2E70]";
  const label = "block text-lg font-semibold leading-snug sm:text-xl";
  const helper = "mt-1 text-sm text-[#26221D]/60";

  return (
    <div dir="rtl" lang="he" className={shell}>
      <Helmet>
        <title>מהידע שלך למוצר | AI Master</title>
        <meta
          name="description"
          content="הדגמה קצרה שהופכת את הניסיון המקצועי שלכם לשלושה כיווני מוצר קטנים לבדיקה."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-8 pb-2">
        <span className="text-sm tracking-wide text-[#26221D]/60">AI Master | אבי פריד</span>
        {stage !== "intro" && (
          <button type="button" className="text-sm text-[#26221D]/60 underline underline-offset-4 hover:text-[#4B2E70]" onClick={() => setConfirmReset(true)}>
            להתחיל מחדש
          </button>
        )}
      </header>

      <div ref={liveRef} aria-live="polite" className="sr-only">
        {errors || savedMsg || (stage === "loading" ? "מכינים שלושה כיוונים" : "")}
      </div>

      <main id="main-content" className="mx-auto max-w-5xl px-5 pb-24 pt-4">
        {confirmReset && (
          <div className={`${card} mb-8 p-5`} role="alertdialog" aria-label="אישור התחלה מחדש">
            <p className="text-base">להתחיל מחדש? התשובות ששמורות במכשיר הזה יימחקו.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className={primaryBtn} onClick={resetAll}>
                כן, למחוק ולהתחיל
              </button>
              <button type="button" className={ghostBtn} onClick={() => setConfirmReset(false)}>
                ביטול
              </button>
            </div>
          </div>
        )}

        {/* ---------------------- מסך פתיחה ---------------------- */}
        {stage === "intro" && (
          <section className="grid items-center gap-12 py-10 md:grid-cols-[1.15fr_0.85fr] md:py-16">
            <div>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                מה אפשר לבנות מהידע שלך?
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#26221D]/75">
                ספרו לנו במה אתם טובים ובמה אנשים נעזרים בכם. תקבלו שלושה כיווני מוצרים שמבוססים על
                הניסיון שלכם, ותוכלו לבחור אחד ולראות איך מתחילים לבדוק אותו.
              </p>
              <div className="mt-8">
                <button type="button" className={primaryBtn} onClick={() => setStage("quiz")}>
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  לגלות את הכיוונים שלי
                </button>
                <p className="mt-3 text-sm text-[#26221D]/60">לא צריך להגיע עם רעיון מוכן.</p>
              </div>
            </div>

            {/* שלוש פתקיות עריכתיות */}
            <ul className="relative mx-auto flex w-full max-w-sm flex-col gap-4">
              <span aria-hidden="true" className="absolute right-6 top-10 bottom-10 w-px bg-[#26221D]/15" />
              {[
                { t: "ניסיון", s: "מה שאתם יודעים לעשות כבר היום" },
                { t: "בעיה", s: "מה שאנשים באמת מבקשים מכם" },
                { t: "מוצר קטן", s: "תוצר אחד מוגדר שאפשר לבדוק" },
              ].map((n, i) => (
                <li
                  key={n.t}
                  className={`${card} relative z-10 mr-3 p-4 ${i === 1 ? "sm:translate-x-[-10px]" : ""}`}
                >
                  <p className="text-base font-semibold text-[#4B2E70]">{n.t}</p>
                  <p className="mt-1 text-sm text-[#26221D]/65">{n.s}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------------------- שאלון ---------------------- */}
        {stage === "quiz" && (
          <section aria-label="שאלון" className="py-6">
            <p className="text-sm text-[#26221D]/60">שאלה {step + 1} מתוך {QUESTIONS}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#26221D]/10" role="progressbar" aria-valuemin={1} aria-valuemax={QUESTIONS} aria-valuenow={step + 1}>
              <div className="h-full rounded-full bg-[#4B2E70] transition-all duration-300" style={{ width: `${((step + 1) / QUESTIONS) * 100}%` }} />
            </div>

            <form
              className={`${card} mt-6 p-5 sm:p-8`}
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              {step === 0 && (
                <div>
                  <label className={label} htmlFor="q1">במה אתם עוסקים, או איזה ניסיון משמעותי צברתם?</label>
                  <p className={helper} id="q1-help">אפשר לציין עבודה, עסק, תחביב או ניסיון אישי רלוונטי.</p>
                  <textarea id="q1" aria-describedby="q1-help" rows={4} className={`${field} mt-4`} value={answers.expertise} onChange={(e) => set("expertise", e.target.value)} />
                </div>
              )}

              {step === 1 && (
                <div>
                  <label className={label} htmlFor="q2">על מה אנשים מבקשים מכם עזרה?</label>
                  <p className={helper} id="q2-help">כדאי לכתוב דוגמה קונקרטית, לא רק תכונה כללית כמו ‘אני יצירתי’.</p>
                  <textarea id="q2" aria-describedby="q2-help" rows={4} className={`${field} mt-4`} value={answers.helpWith} onChange={(e) => set("helpWith", e.target.value)} />
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className={label} htmlFor="q3">
                    {answers.noStory ? "איזו משימה אתם יודעים לבצע היטב?" : "ספרו על מקרה אחד שבו עזרתם למישהו לפתור בעיה."}
                  </label>
                  <p className={helper} id="q3-help">
                    {answers.noStory ? "משימה אחת מוגדרת, כזו שאתם עושים בביטחון." : "מה הייתה הבעיה, מה עשיתם ומה השתנה בעקבות העזרה?"}
                  </p>
                  <textarea id="q3" aria-describedby="q3-help" rows={4} className={`${field} mt-4`} value={answers.story} onChange={(e) => set("story", e.target.value)} />
                  <div className="mt-3 flex items-center gap-2">
                    <input id="no-story" type="checkbox" className="h-5 w-5 rounded border-[#26221D]/30 accent-[#4B2E70]" checked={answers.noStory} onChange={(e) => set("noStory", e.target.checked)} />
                    <label htmlFor="no-story" className="text-base">אין לי דוגמה כרגע</label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <label className={label} htmlFor="q4">למי הייתם רוצים לעזור, והאם יש לכם דרך להגיע לאנשים כאלה?</label>
                  <p className={helper} id="q4-help">אפשר לענות ‘עדיין לא ברור לי’.</p>
                  <textarea id="q4" aria-describedby="q4-help" rows={4} className={`${field} mt-4`} value={answers.audience} onChange={(e) => set("audience", e.target.value)} />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-7">
                  <h2 className={label}>מה מתאים לכם כרגע?</h2>

                  <fieldset>
                    <legend className="text-base font-medium">האם כבר מכרתם משהו בתחום?</legend>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {([["yes", "כן"], ["no", "עדיין לא"]] as [SoldBefore, string][]).map(([v, t]) => (
                        <label key={v} className={`cursor-pointer rounded-full border px-4 py-2 text-base ${answers.soldBefore === v ? "border-[#4B2E70] bg-[#4B2E70]/10" : "border-[#26221D]/20"}`}>
                          <input type="radio" name="sold" className="sr-only" checked={answers.soldBefore === v} onChange={() => set("soldBefore", v)} />
                          {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-base font-medium">כמה זמן שבועי פנוי לכם?</legend>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {([["upto2", "עד 2 שעות"], ["3to5", "3–5 שעות"], ["6plus", "6 ומעלה"]] as [TimeBudget, string][]).map(([v, t]) => (
                        <label key={v} className={`cursor-pointer rounded-full border px-4 py-2 text-base ${answers.time === v ? "border-[#4B2E70] bg-[#4B2E70]/10" : "border-[#26221D]/20"}`}>
                          <input type="radio" name="time" className="sr-only" checked={answers.time === v} onChange={() => set("time", v)} />
                          {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-base font-medium">מה ההעדפה שלכם?</legend>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {([["people", "עבודה עם אנשים"], ["self", "מוצר לשימוש עצמאי"], ["both", "פתוח לשניהם"]] as [Preference, string][]).map(([v, t]) => (
                        <label key={v} className={`cursor-pointer rounded-full border px-4 py-2 text-base ${answers.preference === v ? "border-[#4B2E70] bg-[#4B2E70]/10" : "border-[#26221D]/20"}`}>
                          <input type="radio" name="pref" className="sr-only" checked={answers.preference === v} onChange={() => set("preference", v)} />
                          {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {errors && <p className="mt-5 text-base text-[#8A3324]">{errors}</p>}

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="submit" className={primaryBtn}>
                  {step === QUESTIONS - 1 ? "לסיכום" : "הבא"}
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                </button>
                <button type="button" className={ghostBtn} onClick={back}>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  הקודם
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ---------------------- סיכום ---------------------- */}
        {stage === "summary" && (
          <section className="py-6">
            <h2 className="text-2xl font-bold sm:text-3xl">זה מה שהבנו</h2>
            <dl className={`${card} mt-6 divide-y divide-[#26221D]/10 p-5 sm:p-8`}>
              {[
                ["התחום והניסיון", answers.expertise],
                ["מה מבקשים מכם", answers.helpWith],
                [answers.noStory ? "משימה שאתם עושים היטב" : "מקרה שבו עזרתם", answers.story],
                ["למי תרצו לעזור", answers.audience],
                [
                  "המצב כרגע",
                  `${answers.soldBefore === "yes" ? "כבר מכרתם בתחום" : "עדיין לא מכרתם בתחום"} · ${timeScope[(answers.time || "3to5") as TimeBudget]} · ${answers.preference === "people" ? "עבודה עם אנשים" : answers.preference === "self" ? "מוצר לשימוש עצמאי" : "פתוח לשני הכיוונים"}`,
                ],
              ].map(([t, v]) => (
                <div key={t as string} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-sm text-[#26221D]/55">{t}</dt>
                  <dd className="mt-1 text-base leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className={primaryBtn} onClick={() => showIdeas(tweak)}>
                הציגו לי שלושה כיוונים
              </button>
              <button type="button" className={ghostBtn} onClick={() => { setStage("quiz"); setStep(0); }}>
                לתקן תשובות
              </button>
            </div>
          </section>
        )}

        {/* ---------------------- טעינה ---------------------- */}
        {stage === "loading" && (
          <section className="flex min-h-[45vh] flex-col items-center justify-center text-center">
            <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-[#4B2E70]" />
            <p className="mt-5 text-lg">מסדרים את מה שכתבתם לשלושה כיוונים…</p>
            <p className="mt-2 text-sm text-[#26221D]/60">רגע אחד.</p>
          </section>
        )}

        {/* ---------------------- שלושה רעיונות ---------------------- */}
        {stage === "ideas" && (
          <section className="py-6">
            <h2 className="text-2xl font-bold sm:text-3xl">שלושה כיוונים מתוך מה שכתבתם</h2>
            <p className="mt-3 max-w-2xl text-base text-[#26221D]/70">
              אלה כיוונים לבדיקה, לא הבטחות. בחרו אחד וקבלו כרטיס מוצר עם צעד ראשון.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {ideas.map((idea) => (
                <article key={idea.id} className={`${card} flex flex-col p-6`}>
                  <h3 className="text-xl font-bold leading-snug text-[#4B2E70]">{idea.name}</h3>
                  <dl className="mt-4 flex-1 space-y-4 text-[15px] leading-relaxed">
                    <div><dt className="text-sm text-[#26221D]/55">מה הלקוח מקבל</dt><dd className="mt-1">{idea.deliverable}</dd></div>
                    <div><dt className="text-sm text-[#26221D]/55">למי זה מתאים</dt><dd className="mt-1">{idea.forWhom}</dd></div>
                    <div><dt className="text-sm text-[#26221D]/55">הבעיה שנפתרת</dt><dd className="mt-1">{idea.problem}</dd></div>
                    <div><dt className="text-sm text-[#26221D]/55">למה דווקא אתם</dt><dd className="mt-1">{idea.whyYou}</dd></div>
                    <div><dt className="text-sm text-[#26221D]/55">גרסה ראשונה קטנה</dt><dd className="mt-1">{idea.firstVersion}</dd></div>
                    {idea.audienceUnclear && (
                      <p className="rounded-lg bg-[#5B7553]/10 px-3 py-2 text-sm text-[#3E5137]">
                        הנחה לבדיקה: הקהל הראשוני הוא {idea.forWhom}.
                      </p>
                    )}
                  </dl>
                  <button type="button" className={`${primaryBtn} mt-6 w-full`} onClick={() => pick(idea)}>
                    לבדוק את הכיוון הזה
                  </button>
                </article>
              ))}
            </div>

            <div className={`${card} mt-10 p-5 sm:p-7`}>
              <label className="text-lg font-semibold" htmlFor="tweak">מה לא התאים?</label>
              <p className={helper}>כתבו במילים שלכם מה לשנות, והכיוונים ייבנו מחדש.</p>
              <textarea id="tweak" rows={3} className={`${field} mt-4`} value={tweak} onChange={(e) => setTweak(e.target.value)} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className={primaryBtn} onClick={() => showIdeas(tweak)}>
                  הציעו כיוונים מעודכנים
                </button>
                <button type="button" className={ghostBtn} onClick={() => { setStage("quiz"); setStep(0); }}>
                  לשנות את התשובות
                </button>
              </div>
            </div>

            <CourseCTA card={card} primaryBtn={primaryBtn} />
          </section>
        )}

        {/* ---------------------- כרטיס מוצר ---------------------- */}
        {stage === "product" && selected && (
          <section className="py-6">
            <button type="button" className={`${ghostBtn} mb-6`} onClick={() => setStage("ideas")}>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
              חזרה לשלושת הכיוונים
            </button>

            <article className={`${card} p-6 sm:p-9`}>
              <div className="flex items-center gap-2 text-sm text-[#5B7553]">
                <Lightbulb aria-hidden="true" className="h-4 w-4" />
                כרטיס המוצר שלכם
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="p-name" className="text-sm text-[#26221D]/55">שם המוצר</label>
                  <input id="p-name" className={`${field} mt-1`} value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="p-aud" className="text-sm text-[#26221D]/55">הלקוח הראשון לבדיקה</label>
                  <input id="p-aud" className={`${field} mt-1`} value={editAudience} onChange={(e) => setEditAudience(e.target.value)} />
                </div>
              </div>

              <h2 className="mt-8 text-2xl font-bold leading-snug text-[#4B2E70]">{editName}</h2>
              <p className="mt-2 text-base leading-relaxed">{selected.deliverable}</p>

              <dl className="mt-7 grid gap-5 sm:grid-cols-2">
                <div><dt className="text-sm text-[#26221D]/55">הבעיה והמקרה</dt><dd className="mt-1 text-base leading-relaxed">{selected.problem}</dd></div>
                <div><dt className="text-sm text-[#26221D]/55">התוצאה עבור {editAudience}</dt><dd className="mt-1 text-base leading-relaxed">{selected.whyYou}</dd></div>
                <div><dt className="text-sm text-[#26221D]/55">מה כלול בגרסה הראשונה</dt><dd className="mt-1 text-base leading-relaxed">{selected.firstVersion}</dd></div>
                <div><dt className="text-sm text-[#26221D]/55">מה להשאיר להמשך</dt><dd className="mt-1 text-base leading-relaxed">תמחור מלא, שיווק רחב וכל תוספת שאינה נדרשת לבדיקה הראשונה.</dd></div>
                <div><dt className="text-sm text-[#26221D]/55">ההנחה החשובה לבדיקה</dt><dd className="mt-1 text-base leading-relaxed">{selected.assumption}</dd></div>
                <div><dt className="text-sm text-[#26221D]/55">פעולה אחת לשבוע הקרוב</dt><dd className="mt-1 text-base leading-relaxed">{selected.weeklyAction}</dd></div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" className={primaryBtn} onClick={copyCard}>
                  {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <ClipboardCopy aria-hidden="true" className="h-4 w-4" />}
                  העתקת כרטיס המוצר
                </button>
                {copied && <span className="text-base text-[#3E5137]">הכרטיס הועתק.</span>}
                {copyError && <span className="text-base text-[#8A3324]">{copyError}</span>}
              </div>
            </article>

            {/* שמירה מקומית */}
            <div className={`${card} mt-8 p-6 sm:p-8`}>
              <h3 className="text-xl font-semibold">רוצים לשמור את הכיוון שבחרתם?</h3>
              <p className="mt-2 text-sm text-[#26221D]/65">אפשר להמשיך להשתמש בתוצאה גם בלי למלא פרטים.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lead-name" className="text-sm text-[#26221D]/55">שם (אופציונלי)</label>
                  <input id="lead-name" className={`${field} mt-1`} value={leadName} onChange={(e) => setLeadName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="lead-email" className="text-sm text-[#26221D]/55">מייל (אופציונלי)</label>
                  <input id="lead-email" type="email" inputMode="email" className={`${field} mt-1`} value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2">
                <input id="opt-in" type="checkbox" className="mt-1 h-5 w-5 rounded border-[#26221D]/30 accent-[#4B2E70]" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
                <label htmlFor="opt-in" className="text-base leading-relaxed">
                  אשמח לקבל מאבי פריד תכנים ועדכונים על פיתוח מוצרים עם AI
                </label>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" className={primaryBtn} onClick={saveLocal}>שמירת הכיוון</button>
                {savedMsg && <span className="text-base text-[#3E5137]">{savedMsg}</span>}
              </div>
              <p className="mt-4 text-sm text-[#26221D]/55">בגרסת ההדגמה השמירה מתבצעת במכשיר הזה בלבד.</p>
              <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm text-[#26221D]/60 underline underline-offset-4 hover:text-[#4B2E70]" onClick={() => setConfirmReset(true)}>
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                להתחיל מחדש
              </button>
            </div>

            <CourseCTA card={card} primaryBtn={primaryBtn} />
          </section>
        )}
      </main>
    </div>
  );
}

function CourseCTA({ card, primaryBtn }: { card: string; primaryBtn: string }) {
  return (
    <aside className={`${card} mt-12 p-6 sm:p-9`}>
      <h2 className="text-2xl font-bold leading-snug">יש לכם כיוון. עכשיו אפשר להתחיל לפתח אותו.</h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#26221D]/75">
        בקורס ‘מרעיון לעסק עם AI’ של אבי פריד ממשיכים מהכיוון הראשוני לבירור הקהל, פיתוח המוצר
        וההצעה, ובניית דף שמציג אותם.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className={primaryBtn} disabled aria-describedby="course-link-note">
          להכיר את הקורס
        </button>
        <span id="course-link-note" className="text-sm text-[#26221D]/60">הקישור יוגדר בהמשך</span>
      </div>
    </aside>
  );
}
