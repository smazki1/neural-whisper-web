import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Play } from "lucide-react";
import "./HoverDemo.css";

type Demo = { title: string; src: string; poster: string; alt: string; caption: string };

export function HoverDemo({ demo }: { demo: Demo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playbackRequested = useRef(false);
  const playbackRequest = useRef(0);

  const stop = useCallback(() => {
    playbackRequested.current = false;
    playbackRequest.current += 1;
    // Cover the video before seeking so a decoded final frame can never flash.
    flushSync(() => setPlaying(false));
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);
  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Keep keyboard activation immediate even before the proximity observer runs.
    if (!video.getAttribute("src")) video.src = demo.src;
    playbackRequested.current = true;
    const request = ++playbackRequest.current;
    video.muted = true;
    void video.play().catch(() => {
      if (request === playbackRequest.current) stop();
    });
  }, [demo.src, stop]);

  useEffect(() => {
    const showcase = showcaseRef.current;
    const video = videoRef.current;
    if (!showcase || !video) return;
    // Observe the stationary wrapper so the frame's lift cannot retrigger playback.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    }, { threshold: 0 });
    observer.observe(showcase);
    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        preloadObserver.disconnect();
      }
    }, { rootMargin: "600px" });
    preloadObserver.observe(showcase);
    return () => {
      observer.disconnect();
      preloadObserver.disconnect();
      playbackRequested.current = false;
      playbackRequest.current += 1;
      video.pause();
    };
  }, [stop]);

  return <div ref={showcaseRef} className="demo-showcase">
    <h3 className="mb-3 text-center text-xl font-bold text-blue-900">{demo.title}</h3>
    <button
      type="button"
      aria-label={`${playing ? "עצירת" : "הפעלת"} הדגמה: ${demo.alt}`}
      aria-pressed={playing}
      className="demo-showcase__frame"
      data-playing={playing}
      onClick={() => playbackRequested.current ? stop() : play()}
    >
      <span className="demo-showcase__screen">
        <video ref={videoRef} src={ready ? demo.src : undefined} poster={ready ? demo.poster : undefined} muted loop playsInline preload="auto" aria-hidden="true" onPlaying={() => {
          if (playbackRequested.current) setPlaying(true);
          else videoRef.current?.pause();
        }} onPause={() => { if (playbackRequested.current) stop(); }} onError={stop} />
        <img src={ready ? demo.poster : undefined} alt="" draggable={false} loading="lazy" className={playing ? "invisible" : "visible"} />
      </span>
      <span className="demo-showcase__gesture" aria-hidden="true">
        <Play strokeWidth={1.6} fill="currentColor" />
      </span>
    </button>
  </div>;
}
