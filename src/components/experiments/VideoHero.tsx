import { useEffect, useRef, useState } from 'react';
import heroBackground from '@/assets/hero-bg-ai-modern.jpg';
import heroVideo from '@/assets/experiments/avi-hero-0920-v2-1080p.mp4';
import './video-hero.css';

export default function VideoHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState('static');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forceStatic = import.meta.env.DEV && new URLSearchParams(location.search).get('still') === '1';
    let stop: (() => void) | undefined;

    const start = () => {
      stop?.();
      setPlaying(false);
      if (media.matches || forceStatic) {
        setStatus('reduced-motion');
        return;
      }
      setStatus('loading');
      let disposed = false;
      const fallback = (reason: string) => {
        if (disposed) return;
        stop?.();
        setPlaying(false);
        setStatus(reason);
      };
      const timeout = window.setTimeout(() => fallback('unavailable'), 15000);
      const onPlaying = () => {
        if (disposed) return;
        clearTimeout(timeout);
        setPlaying(true);
        setStatus('playing');
      };
      const onError = () => fallback('unavailable');
      stop = () => {
        disposed = true;
        clearTimeout(timeout);
        element.removeEventListener('playing', onPlaying);
        element.removeEventListener('error', onError);
        element.pause();
        element.removeAttribute('src');
        element.load();
      };
      element.addEventListener('playing', onPlaying);
      element.addEventListener('error', onError);
      element.muted = true;
      element.volume = 0;
      element.src = heroVideo;
      element.play().catch(() => fallback('autoplay-blocked'));
    };

    start();
    media.addEventListener('change', start);
    return () => {
      stop?.();
      media.removeEventListener('change', start);
    };
  }, []);

  return (
    <section className="video-hero font-heebo" dir="rtl" data-video-status={status} data-video-muted="true">
      <img className="video-hero__fallback" src={heroBackground} alt="" />
      <video ref={video} className={`video-hero__player ${playing ? 'is-playing' : ''}`}
        muted autoPlay loop playsInline preload="none" poster={heroBackground}
        aria-hidden="true" tabIndex={-1} />
      <div className="video-hero__shade" aria-hidden="true" />
      <div className="video-hero__content">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] tracking-wide text-white">
          להיות על זה בעידן <span className="whitespace-nowrap">ה-<span className="video-hero__accent">AI</span></span>
        </h1>

      </div>
    </section>
  );
}
