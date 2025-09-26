import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageOptimizer = ({
  src,
  alt,
  className,
  width,
  height,
  lazy = true,
  quality = 75,
  priority = false,
  placeholder = 'empty',
  onLoad,
  onError
}: ImageOptimizerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, priority, isInView]);

  // Generate responsive image URLs (placeholder for future CDN integration)
  const generateSrcSet = (baseSrc: string) => {
    // For now, return the original src
    // In the future, this could generate different sizes: 480w, 768w, 1024w, etc.
    return baseSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Don't render anything if not in view (for lazy loading)
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={cn(
          'bg-muted animate-pulse',
          className
        )}
        style={{ width, height }}
        aria-label={`טוען תמונה: ${alt}`}
      />
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder while loading */}
      {!isLoaded && placeholder === 'blur' && (
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            'flex items-center justify-center text-muted-foreground'
          )}
          aria-hidden="true"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={src}
        srcSet={generateSrcSet(src)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'hidden',
          className
        )}
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />

      {/* Error fallback */}
      {hasError && (
        <div
          className={cn(
            'bg-muted flex items-center justify-center text-muted-foreground',
            'border border-border rounded',
            className
          )}
          style={{ width, height }}
          role="img"
          aria-label={`שגיאה בטעינת תמונה: ${alt}`}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.882 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};