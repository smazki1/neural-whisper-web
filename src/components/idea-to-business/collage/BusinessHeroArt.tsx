import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

const images = "/images/idea-to-business/";

function StoryPaper({ children, className, progress, start, tilt }: {
  children: ReactNode;
  className: string;
  progress: MotionValue<number>;
  start: number;
  tilt: number;
}) {
  const reduced = useReducedMotion();
  const y = useTransform(progress, [start, start + .36, 1], [20, 0, -5]);
  const rotate = useTransform(progress, [start, start + .36], [tilt * 1.7, tilt]);
  return <motion.div className={className} style={reduced ? { rotate: tilt } : { y, rotate }}>
    {children}
  </motion.div>;
}

function BekolPreview() {
  return <div className="bekol-window">
    <div className="bekol-chrome" aria-hidden="true"><i /><i /><i /></div>
    <div className="bekol-cover">
      <div className="bekol-wordmark">בקול<small>אימון מנטלי לדיבור מול קהל</small></div>
      <div className="bekol-message">לדבר,<br />גם כשהלב דופק.</div>
      <span className="bekol-invite">בואו נדבר</span>
      <img className="bekol-mic" src={images + "bekol-stage-mic.webp"} alt="" width="175" height="420" />
    </div>
  </div>;
}

function GoldThread({ progress, mobile = false }: { progress: MotionValue<number>; mobile?: boolean }) {
  const reduced = useReducedMotion();
  const turn = useTransform(progress, [.48, 1], [0, 1]);
  const lead = useTransform(progress, [0, .65], [0, 1]);
  const path = mobile
    ? "M230 67 C204 67 191 114 74 114 S75 195 183 195 S238 263 161 263 V438 Q161 497 62 522"
    : "M91 52 H33";
  const sweep = "M91 52 Q97 52 97 69 V82 Q97 96 92 96 H31";
  return <svg className={mobile ? "gold-thread mobile-thread" : "gold-thread desktop-thread"}
    viewBox={mobile ? "0 0 300 550" : "0 0 100 100"} preserveAspectRatio="none" aria-hidden="true">
    <path d={path} className="thread-guide" vectorEffect="non-scaling-stroke" />
    <motion.path d={path} className="thread-ink" vectorEffect="non-scaling-stroke"
      style={{ pathLength: reduced ? 1 : mobile ? progress : lead }} />
    {!mobile && <>
      <path d={sweep} className="thread-guide" vectorEffect="non-scaling-stroke" />
      <motion.path d={sweep} className="thread-ink" vectorEffect="non-scaling-stroke"
        style={{ pathLength: reduced ? 1 : turn }} />
    </>}
  </svg>;
}

export function BusinessHeroArt() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.65", "end 0.23"] });
  const reduced = useReducedMotion();
  const coralAngle = useTransform(scrollYProgress, [.18, .73], [5, 19]);
  const creamAngle = useTransform(scrollYProgress, [.18, .73], [3, 11]);
  const draw = useTransform(scrollYProgress, [0, 1], [.12, 1]);
  return <figure className="night-ribbon" ref={ref} aria-label="דוגמה למיקוד עסק: ממאמן מנטלי לכולם ועד למותג בקול, לאנשים שחוששים לדבר מול קהל">
    <div className="ribbon-artwork" aria-hidden="true" />
    <div className="ribbon-layout">
      <GoldThread progress={draw} />
      <GoldThread progress={draw} mobile />
      <StoryPaper className="ribbon-idea paper-note" progress={scrollYProgress} start={0} tilt={5}>
        <strong>מאמן מנטלי</strong><span>למי? <s>לכולם.</s></span>
      </StoryPaper>
      <StoryPaper className="ribbon-audience paper-note" progress={scrollYProgress} start={.12} tilt={-6}>
        <strong>לאנשים שחוששים<br />לדבר מול קהל.</strong>
      </StoryPaper>
      <StoryPaper className="ribbon-colors" progress={scrollYProgress} start={.25} tilt={-4}>
        <motion.div className="swatch-back" style={{ x: "18%", y: "-5%", rotate: reduced ? 19 : coralAngle }} />
        <motion.div className="swatch-middle" style={{ x: "9%", y: "2%", rotate: reduced ? 11 : creamAngle }} />
        <div className="swatch-front">צבעי<br />המותג</div>
      </StoryPaper>
      <StoryPaper className="ribbon-site" progress={scrollYProgress} start={.4} tilt={-3}>
        <BekolPreview />
      </StoryPaper>
    </div>
  </figure>;
}
