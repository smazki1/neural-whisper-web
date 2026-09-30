import { useEffect } from "react";

/** Pause decorative loops offscreen without changing their visible timing. */
export function useLandingMotionVisibility() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".idea-to-business :is(.demo-showcase, .upcoming-library, .kts, .tfp)",
    );
    const visible = new Set<Element>();
    const update = () => elements.forEach(element => {
      element.dataset.motionVisible = String(!document.hidden && visible.has(element));
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      update();
    });
    elements.forEach(element => observer.observe(element));
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
}
