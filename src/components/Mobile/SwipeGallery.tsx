import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileOptimizedImage } from './MobileOptimizedImage';

interface SwipeGalleryItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface SwipeGalleryProps {
  items: SwipeGalleryItem[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  aspectRatio?: string;
}

export const SwipeGallery: React.FC<SwipeGalleryProps> = ({
  items,
  className = '',
  autoPlay = false,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true,
  aspectRatio = '16/9',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setCurrentIndex((index) => {
      const newIndex = index + newDirection;
      if (newIndex >= 0 && newIndex < items.length) return newIndex;
      if (newIndex >= items.length) return 0;
      return items.length - 1;
    });
  }, [items.length]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length, paginate]);

  // Touch gesture handling
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setDragStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!dragStartX) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diff = dragStartX - touchEndX;
      const minSwipeDistance = 50;

      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
          paginate(1); // Swipe left - next image
        } else {
          paginate(-1); // Swipe right - previous image
        }
      }
      
      setDragStartX(0);
    };

    const element = constraintsRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [dragStartX, paginate]);

  if (items.length === 0) return null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Gallery Container */}
      <div
        ref={constraintsRef}
        className="relative overflow-hidden rounded-xl bg-muted"
        style={{ aspectRatio }}
      >
        <AnimatePresence initial={false} custom={1}>
          <motion.div
            key={currentIndex}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <MobileOptimizedImage
              src={items[currentIndex].src}
              alt={items[currentIndex].alt}
              className="w-full h-full"
              priority={currentIndex === 0}
            />
            
            {/* Content Overlay */}
            {(items[currentIndex].title || items[currentIndex].description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                {items[currentIndex].title && (
                  <h3 className="text-white text-lg font-bold mb-2">
                    {items[currentIndex].title}
                  </h3>
                )}
                {items[currentIndex].description && (
                  <p className="text-white/90 text-sm leading-relaxed">
                    {items[currentIndex].description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {showArrows && items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-200 touch-manipulation
                ${index === currentIndex 
                  ? 'bg-primary scale-110' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe Instructions (Mobile Only) */}
      <div className="md:hidden text-center mt-2">
        <p className="text-xs text-muted-foreground">
          החלק לצידים לעבור בין התמונות
        </p>
      </div>
    </div>
  );
};
