import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pointer } from "lucide-react";
import "./HoverDemo.css";

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

  return <div className="demo-showcase">
    <button
      ref={buttonRef}
      type="button"
      aria-label={`${playing ? "עצירת" : "הפעלת"} הדגמה: ${demo.alt}`}
      aria-pressed={playing}
      className="demo-showcase__frame"
      data-playing={playing}
      onPointerEnter={event => { if (event.pointerType === "mouse" && !reducedMotion) play(); }}
      onPointerLeave={event => { if (event.pointerType === "mouse") stop(); }}
      onClick={() => playing ? stop() : play()}
      onBlur={stop}
    >
      <span className="demo-showcase__screen">
        <video ref={videoRef} src={demo.src} poster={demo.poster} muted loop playsInline preload="none" aria-hidden="true" onError={stop} />
        <img src={demo.poster} alt="" draggable={false} loading="lazy" className={playing ? "invisible" : "visible"} />
      </span>
      <span className="demo-showcase__gesture" aria-hidden="true">
        <span className="demo-showcase__ripple" />
        <Pointer strokeWidth={1.8} />
      </span>
    </button>
  </div>;
}
