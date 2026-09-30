import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

/** Reserve the image's space, then fetch it shortly before it reaches the screen. */
export function LandingImage({ src, srcSet, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "1000px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <img {...props} ref={ref} src={ready ? src : undefined} srcSet={ready ? srcSet : undefined} decoding="async" />;
}
