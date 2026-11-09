import { useEffect, useRef, useState } from "react";
import "@/pages/business-motion.css";

export function BusinessStory() {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const visible = useRef(false);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const sync = () => frame.current?.contentWindow?.postMessage({
      type: "business-journey-visibility",
      visible: visible.current && !document.hidden,
    }, window.location.origin);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting && entry.intersectionRatio >= .2;
      sync();
    }, { threshold: [0, .2] });
    if (host.current) observer.observe(host.current);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "business-journey-ready") sync();
      if (event.data?.type === "business-journey-size" && Number.isFinite(event.data.height) && event.data.height > 100 && event.data.height < 2500) setHeight(event.data.height);
    };
    window.addEventListener("message", receive);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("message", receive);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <section className="business-motion cw-shell" id="collage-process" aria-labelledby="business-motion-title">
    <div className="bm-intro"><h2 id="business-motion-title">העסק שלכם יכול<br/><em>להתקדם הרבה יותר מהר.</em></h2></div>
    <div ref={host} className="bm-live-embed">
      <iframe ref={frame} src="/business-journey/index.html?embed" title="המסע בקורס: מכיוון ראשוני להצעה ולאתר" loading="lazy" style={height ? { height } : undefined} />
    </div>
  </section>;
}
