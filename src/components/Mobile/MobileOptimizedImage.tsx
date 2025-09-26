import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const MobileOptimizedImage: React.FC<MobileOptimizedImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const shouldLoad = priority || isIntersecting;

  useEffect(() => {
    if (!shouldLoad || !imgRef.current) return;

    const img = imgRef.current;
    
    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [shouldLoad, onLoad, onError]);

  // Generate responsive image URLs (placeholder implementation)
  const generateSrcSet = (baseSrc: string) => {
    const formats = ['webp', 'avif'];
    const widths = [320, 640, 768, 1024, 1280, 1920];
    
    // This is a placeholder - in a real app, you'd use a service like Cloudinary or ImageKit
    return widths.map(width => `${baseSrc}?w=${width} ${width}w`).join(', ');
  };

  return (
    <div
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Placeholder/Loading State */}
      {(!isLoaded && !hasError) && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          {placeholder === 'blur' && blurDataURL && (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-110"
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground p-4">
            <svg 
              className="w-12 h-12 mx-auto mb-2 opacity-50" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span className="text-sm">Failed to load image</span>
          </div>
        </div>
      )}

      {/* Main Image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            // Prevent layout shift
            aspectRatio: 'attr(width) / attr(height)',
          }}
        />
      )}
    </div>
  );
};