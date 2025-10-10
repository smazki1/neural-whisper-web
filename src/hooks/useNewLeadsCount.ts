import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNewLeadsCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNewLeadsCount = async () => {
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
  };

  useEffect(() => {
    fetchNewLeadsCount();

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
          fetchNewLeadsCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { count, loading, refresh: fetchNewLeadsCount };
};
