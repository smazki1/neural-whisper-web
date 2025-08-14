import { useQuery, useQueryClient, QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// Create optimized query client with enhanced caching
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  });
};

// Hook for courses with background refetching
export const useOptimizedCourseQuery = (courseId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['course', courseId],
    staleTime: 10 * 60 * 1000, // 10 minutes for courses
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    refetchInterval: 5 * 60 * 1000, // Background refetch every 5 minutes
  });

  // Prefetch related data
  useEffect(() => {
    if (query.data && typeof query.data === 'object' && 'id' in query.data) {
      // Prefetch lessons for this course
      queryClient.prefetchQuery({
        queryKey: ['course-lessons', (query.data as any).id],
        staleTime: 15 * 60 * 1000,
      });
    }
  }, [query.data, queryClient]);

  return query;
};

// Hook for posts with infinite cache for published content
export const useOptimizedPostQuery = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    staleTime: 60 * 60 * 1000, // 1 hour for published posts
    gcTime: 24 * 60 * 60 * 1000, // 24 hours cache
    refetchOnWindowFocus: false,
  });
};

// Hook for user-specific data with shorter cache
export const useOptimizedUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    staleTime: 2 * 60 * 1000, // 2 minutes for user data
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true,
  });
};

// Memory cache hook for heavy computations
export const useMemoryCache = <T>(
  key: string,
  computeFn: () => T,
  dependencies: any[] = []
): T => {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData([key]) || (() => {
    const result = computeFn();
    queryClient.setQueryData([key], result);
    return result;
  })();
};