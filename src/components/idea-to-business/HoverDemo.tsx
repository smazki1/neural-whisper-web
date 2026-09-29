import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Play, Pause } from "lucide-react";

type Demo = { src: string; poster: string; alt: string; caption: string };

export function HoverDemo({ demo }: { demo: Demo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  const stop = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPlaying(false);
  };
  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(true);
    void video.play().catch(() => setPlaying(false));
  };

  useEffect(() => {
    const button = buttonRef.current;
    const video = videoRef.current;
    if (!button || !video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
        video.currentTime = 0;
        setPlaying(false);
      }
    });
    observer.observe(button);
    return () => { observer.disconnect(); video.pause(); };
  }, []);

  return <figure className="min-w-0">
    <button
      ref={buttonRef}
      type="button"
      aria-label={`${playing ? "עצירת" : "הפעלת"} הדגמה: ${demo.alt}`}
      aria-pressed={playing}
      className="relative block w-full aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      onPointerEnter={event => { if (event.pointerType === "mouse" && !reducedMotion) play(); }}
      onPointerLeave={event => { if (event.pointerType === "mouse") stop(); }}
      onClick={() => playing ? stop() : play()}
      onBlur={stop}
    >
      <video ref={videoRef} src={demo.src} poster={demo.poster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain" onError={stop} />
      <img src={demo.poster} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-contain ${playing ? "invisible" : "visible"}`} />
      <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-sm font-medium text-white" aria-hidden="true">
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? "עצירה" : "להפעלת הדמו"}
      </span>
    </button>
    <figcaption className="mt-4 text-right"><h3 className="text-xl font-bold text-blue-900">{demo.alt}</h3><p className="mt-2 text-lg leading-relaxed text-slate-600">{demo.caption}</p></figcaption>
  </figure>;
}
