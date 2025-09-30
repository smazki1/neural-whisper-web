import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'instructor' | 'student';

export function useUserRoles(userId?: string | null) {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

  const fetchRoles = useCallback(async () => {
    if (!userId) {
      setRoles([]);
      setLoading(false);
      setHasAttemptedFetch(true);
      return;
    }
    
    setLoading(true);
    setHasAttemptedFetch(false);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (fetchError) {
        console.error('Error fetching user roles:', fetchError);
        setError(fetchError.message);
        setRoles([]);
        setHasAttemptedFetch(true);
        setLoading(false);
      } else {
        const userRoles = (data || []).map(r => r.role as AppRole);
        console.log('Fetched user roles:', userRoles);
        setRoles(userRoles);
        setHasAttemptedFetch(true);
        setLoading(false);
      }
    } catch (err) {
      console.error('Exception fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setRoles([]);
      setHasAttemptedFetch(true);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading: loading || !hasAttemptedFetch, error, refresh: fetchRoles };
}
