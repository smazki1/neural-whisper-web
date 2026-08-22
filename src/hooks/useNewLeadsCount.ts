import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNewLeadsCount = (enabled: boolean) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNewLeadsCount = useCallback(async () => {
    if (!enabled) return;

    try {
      const { count: newCount, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      if (error) throw error;
      setCount(newCount || 0);
    } catch (error) {
      console.error('Error fetching new leads count:', error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    void fetchNewLeadsCount();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('new-leads-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        () => {
          void fetchNewLeadsCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, fetchNewLeadsCount]);

  return { count, loading, refresh: fetchNewLeadsCount };
};
