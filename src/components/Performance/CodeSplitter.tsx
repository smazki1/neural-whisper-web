import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface CodeSplitterProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
}

// Default loading component
const DefaultFallback = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-32 w-full" />
  </div>
);

// Default error component
const DefaultError = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-center">
    <h3 className="text-lg font-semibold text-destructive mb-2">
      שגיאה בטעינת הרכיב
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      {error.message || 'אירעה שגיאה בטעינת התוכן'}
    </p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      נסה שנית
    </button>
  </div>
);

// Error boundary class component
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  },
  { hasError: boolean; error: Error | null; errorId: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorId: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Code splitter error:', error, errorInfo);
  }

  retry = () => {
    this.setState(state => ({
      hasError: false,
      error: null,
      errorId: state.errorId + 1
    }));
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const ErrorComponent = this.props.fallback || DefaultError;
      return <ErrorComponent error={this.state.error} retry={this.retry} />;
    }

    return (
      <div key={this.state.errorId}>
        {this.props.children}
      </div>
    );
  }
}

export const CodeSplitter = ({ 
  children, 
  fallback = <DefaultFallback />,
  error 
}: CodeSplitterProps) => {
  return (
    <ErrorBoundary fallback={error}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Helper function to create lazy components with better error handling
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName?: string
) => {
  return lazy(async () => {
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      console.error(`Failed to load component ${componentName || 'Unknown'}:`, error);
      throw error;
    }
  });
};

// Preload function for critical routes
export const preloadComponent = (importFn: () => Promise<any>) => {
  const promise = importFn();
  promise.catch(error => {
    console.error('Failed to preload component:', error);
  });
  return promise;
};