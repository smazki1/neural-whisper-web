import React from 'react';
import { cn } from '@/lib/utils';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const ScreenReaderOnly = ({ 
  children, 
  as: Component = 'span',
  className 
}: ScreenReaderOnlyProps) => {
  return (
    <Component
      className={cn('sr-only', className)}
    >
      {children}
    </Component>
  );
};

// Utility component for announcing dynamic content changes to screen readers
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

export const LiveRegion = ({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'all',
  className
}: LiveRegionProps) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
};