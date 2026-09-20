import { useEffect, useRef, useState } from 'react';
import heroVideo from '@/assets/experiments/avi-hero-web-1080p.mp4';
import './video-hero.css';

export default function VideoHero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState('static');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    const hero = section.current;
    if (!element || !hero) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forceStatic = import.meta.env.DEV && new URLSearchParams(location.search).get('still') === '1';
    const bounds = hero.getBoundingClientRect();
    let inView = bounds.bottom > 0 && bounds.top < innerHeight;
    let disposed = false;
    let failed = false;
    let attached = false;
    let hasPlayed = false;
    let stallTimer: ReturnType<typeof setTimeout> | undefined;
    const clearStall = () => { clearTimeout(stallTimer); stallTimer = undefined; };
    const allowed = () => !disposed && !failed && !media.matches && !forceStatic && !document.hidden && inView;
    const fallback = (reason: string) => {
      if (disposed) return;
      failed = true;
      clearStall();
      element.pause();
      element.removeAttribute('src');
      element.load();
      setPlaying(false);
      setStatus(reason);
    };
    const syncPlayback = () => {
      if (disposed || failed) return;
      if (!allowed()) {
        clearStall();
        element.pause();
        if (media.matches || forceStatic) {
          setPlaying(false);
          setStatus('reduced-motion');
        } else setStatus('paused');
        return;
      }
      if (!attached) {
        // Attach once. Scrolling away/back never resets the source or restarts a download.
        attached = true;
        element.muted = true;
        element.volume = 0;
        element.preload = 'auto';
        element.src = heroVideo;
        setStatus('loading');
      }
      if (element.paused) element.play().catch((error: DOMException) => {
        if (!allowed() || error.name === 'AbortError') return;
        fallback(error.name === 'NotAllowedError' ? 'autoplay-blocked' : 'unavailable');
      });
    };
    const onPlaying = () => {
      clearStall();
      if (!allowed()) { element.pause(); return; }
      hasPlayed = true;
      setPlaying(true);
      setStatus('playing');
    };
    const onError = () => fallback('unavailable');
    const onWaiting = () => {
      if (!hasPlayed || !allowed() || stallTimer) return;
      // A sustained, observed network stall should show the sharp still, not a frozen frame.
      stallTimer = setTimeout(() => {
        if (allowed() && element.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) fallback('slow-connection');
        clearStall();
      }, 2500);
    };
    element.addEventListener('playing', onPlaying);
    element.addEventListener('error', onError);
    element.addEventListener('waiting', onWaiting);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(hero);
    media.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();
    return () => {
      disposed = true;
      clearStall();
      observer.disconnect();
      media.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      element.removeEventListener('playing', onPlaying);
      element.removeEventListener('error', onError);
      element.removeEventListener('waiting', onWaiting);
      element.pause();
      element.removeAttribute('src');
      element.load();
    };
  }, []);

  return (
    <section ref={section} className="video-hero font-heebo" dir="rtl" data-video-status={status} data-video-muted="true">
      <div className="video-hero__fallback" aria-hidden="true" />
      <video ref={video} className={`video-hero__player ${playing ? 'is-playing' : ''}`}
        muted loop playsInline preload="none"
        aria-hidden="true" tabIndex={-1} />
      <div className="video-hero__shade" aria-hidden="true" />
      <div className="video-hero__content">
        <h1>להיות על זה בעידן <span className="video-hero__nowrap">ה-<span className="video-hero__accent">AI</span></span></h1>
      </div>
    </section>
  );
}
