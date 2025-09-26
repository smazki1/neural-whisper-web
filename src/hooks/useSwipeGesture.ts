import { useRef, useEffect, useState } from 'react';

interface SwipeGestureOptions {
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  deltaX?: number;
  deltaY?: number;
}

interface SwipeGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (touchEvent: TouchEvent) => void;
  onSwipeEnd?: () => void;
}

export const useSwipeGesture = (
  handlers: SwipeGestureHandlers,
  options: SwipeGestureOptions = {}
) => {
  const {
    threshold = 50,
    preventDefaultTouchmoveEvent = false,
    deltaX = 0.3,
    deltaY = 0.3,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    handlers.onSwipeStart?.(e);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    // Check if the swipe is more horizontal than vertical
    if (Math.abs(distanceX) > Math.abs(distanceY) * deltaX) {
      if (isLeftSwipe) {
        handlers.onSwipeLeft?.();
      } else if (isRightSwipe) {
        handlers.onSwipeRight?.();
      }
    }

    // Check if the swipe is more vertical than horizontal
    if (Math.abs(distanceY) > Math.abs(distanceX) * deltaY) {
      if (isUpSwipe) {
        handlers.onSwipeUp?.();
      } else if (isDownSwipe) {
        handlers.onSwipeDown?.();
      }
    }

    handlers.onSwipeEnd?.();
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: !preventDefaultTouchmoveEvent });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [touchStart, touchEnd, handlers, threshold, preventDefaultTouchmoveEvent]);

  return elementRef;
};