import { useEffect } from 'react';

const groups = [
  '.video-intro .grid > div',
  '.home-testimonials__copy',
  '.home-testimonials__carousel',
  '.home-direction__layout',
  '.home-catalog > .home-container',
].join(',');

/** Progressive enhancement: the DOM stays visible unless an entrance is actively playing. */
export default function HomepageMotion() {
  useEffect(() => {
    const root = document.getElementById('main-content');
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1024px)');
    // Local review switch, no public UI and no persistent preference changes.
    const disabled = import.meta.env.DEV && new URLSearchParams(location.search).get('motion') === 'off';
    const seen = new WeakSet<Element>();
    const registered = new Set<HTMLElement>();
    const animations = new Map<HTMLElement, Animation>();
    let entrances: IntersectionObserver | undefined;
    let frame = 0;
    let mission: HTMLElement | null = null;

    const reveal = (element: HTMLElement, animate: boolean) => {
      entrances?.unobserve(element);
      if (seen.has(element)) return;
      seen.add(element);
      element.dataset.homeReveal = 'shown';
      if (!animate || reduced.matches || disabled || !element.animate) return;
      const media = element.matches('.video-intro .grid > :first-child, .home-testimonials__carousel');
      try {
        const animation = element.animate([
          { opacity: 0, translate: '0 20px' },
          { opacity: 1, translate: '0 0' },
        ], { duration: 520, delay: media ? 70 : 0, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'backwards' });
        animations.set(element, animation);
        const release = () => animations.delete(element);
        animation.onfinish = release;
        animation.oncancel = release;
      } catch {
        // Unsupported animation APIs leave the ordinary, visible content intact.
      }
    };

    const clearDepth = () => {
      mission?.style.removeProperty('--mission-art-y');
      mission?.style.removeProperty('--mission-art-size');
    };
    const updateDepth = () => {
      frame = 0;
      if (!mission || reduced.matches || disabled || !desktop.matches) { clearDepth(); return; }
      const bounds = mission.getBoundingClientRect();
      if (bounds.top > innerHeight + 140 || bounds.bottom < 0) return;
      const progress = (innerHeight / 2 - bounds.top - bounds.height / 2) / (innerHeight + bounds.height);
      const offset = Math.max(-18, Math.min(18, progress * 36));
      mission.style.setProperty('--mission-art-y', `${offset.toFixed(2)}px`);
    };
    const queueDepth = () => {
      if (!frame && !reduced.matches && !disabled && desktop.matches) frame = requestAnimationFrame(updateDepth);
    };
    const sizeDepth = () => {
      if (!mission || reduced.matches || disabled || !desktop.matches) { clearDepth(); return; }
      // Overscan the artwork only. The mask/seam and text never move.
      const height = Math.max(mission.clientHeight + 140, mission.clientWidth * 1080 / 1920) + 48;
      mission.style.setProperty('--mission-art-size', `auto ${height}px`);
      queueDepth();
    };
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sizeDepth) : undefined;

    const scan = () => {
      root.querySelectorAll<HTMLElement>(groups).forEach(element => {
        if (registered.has(element)) return;
        registered.add(element);
        element.dataset.homeReveal = 'ready';
        // Do not replay or hide content already on screen on load/anchor navigation.
        if (reduced.matches || disabled || !entrances || element.getBoundingClientRect().top < innerHeight - 40) reveal(element, false);
        else entrances.observe(element);
      });
      const nextMission = root.querySelector<HTMLElement>('.video-intro');
      if (nextMission && mission !== nextMission) {
        mission = nextMission;
        resize?.observe(mission);
        sizeDepth();
      }
    };
    const preferencesChanged = () => {
      entrances?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (!reduced.matches && !disabled && typeof IntersectionObserver !== 'undefined') {
        entrances = new IntersectionObserver(entries => {
          entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target as HTMLElement, true); });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
      } else entrances = undefined;
      registered.forEach(element => {
        if (seen.has(element)) return;
        if (!entrances) reveal(element, false);
        else entrances.observe(element);
      });
      scan();
      sizeDepth();
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target as Element;
      registered.forEach(element => {
        if (!element.contains(target)) return;
        animations.get(element)?.cancel();
        reveal(element, false);
      });
    };

    preferencesChanged();
    const additions = new MutationObserver(scan);
    additions.observe(root, { childList: true, subtree: true });
    reduced.addEventListener('change', preferencesChanged);
    desktop.addEventListener('change', sizeDepth);
    window.addEventListener('scroll', queueDepth, { passive: true });
    window.addEventListener('resize', sizeDepth, { passive: true });
    root.addEventListener('focusin', onFocus);
    return () => {
      entrances?.disconnect();
      additions.disconnect();
      resize?.disconnect();
      animations.forEach(animation => animation.cancel());
      registered.forEach(element => delete element.dataset.homeReveal);
      if (frame) cancelAnimationFrame(frame);
      clearDepth();
      reduced.removeEventListener('change', preferencesChanged);
      desktop.removeEventListener('change', sizeDepth);
      window.removeEventListener('scroll', queueDepth);
      window.removeEventListener('resize', sizeDepth);
      root.removeEventListener('focusin', onFocus);
    };
  }, []);
  return null;
}
