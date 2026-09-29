import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pointer } from "lucide-react";
import "./HoverDemo.css";

type Demo = { title: string; src: string; poster: string; alt: string; caption: string };

export function HoverDemo({ demo }: { demo: Demo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  const stop = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPlaying(false);
  }, []);
  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => setPlaying(false));
  }, []);

  useEffect(() => {
    const showcase = showcaseRef.current;
    const video = videoRef.current;
    if (!showcase || !video) return;
    // Observe the stationary wrapper so the frame's lift cannot retrigger playback.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
        if (!reducedMotion) play();
      } else {
        stop();
      }
    }, { threshold: 0.25 });
    observer.observe(showcase);
    return () => { observer.disconnect(); video.pause(); };
  }, [play, stop, reducedMotion]);

  return <div ref={showcaseRef} className="demo-showcase">
    <h3 className="mb-3 text-center text-xl font-bold text-blue-900">{demo.title}</h3>
    <button
      type="button"
      aria-label={`${playing ? "עצירת" : "הפעלת"} הדגמה: ${demo.alt}`}
      aria-pressed={playing}
      className="demo-showcase__frame"
      data-playing={playing}
      onClick={() => playing ? stop() : play()}
    >
      <span className="demo-showcase__screen">
        <video ref={videoRef} src={demo.src} poster={demo.poster} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={stop} />
        <img src={demo.poster} alt="" draggable={false} loading="lazy" className={playing ? "invisible" : "visible"} />
      </span>
      <span className="demo-showcase__gesture" aria-hidden="true">
        <span className="demo-showcase__ripple" />
        <Pointer strokeWidth={1.8} />
      </span>
    </button>
  </div>;
}
