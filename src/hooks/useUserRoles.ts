import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'instructor' | 'student';

export function useUserRoles(userId?: string | null) {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

  const fetchRoles = useCallback(async () => {
    console.log('[useUserRoles] Starting fetchRoles for userId:', userId);
    
    if (!userId) {
      console.log('[useUserRoles] No userId provided, setting empty roles');
      setRoles([]);
      setLoading(false);
      setHasAttemptedFetch(true);
      return;
    }
    
    console.log('[useUserRoles] Setting loading to true');
    setLoading(true);
    setHasAttemptedFetch(false);
    setError(null);
    
    try {
      console.log('[useUserRoles] Querying user_roles table...');
      const { data, error: fetchError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      console.log('[useUserRoles] Query complete:', { data, error: fetchError });
      
      if (fetchError) {
        console.error('[useUserRoles] Error fetching user roles:', fetchError);
        setError(fetchError.message);
        setRoles([]);
        setLoading(false);
        setHasAttemptedFetch(true);
      } else {
        const userRoles = (data || []).map(r => r.role as AppRole);
        console.log('[useUserRoles] Setting roles:', userRoles);
        setRoles(userRoles);
        setLoading(false);
        setHasAttemptedFetch(true);
      }
    } catch (err) {
      console.error('[useUserRoles] Exception fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setRoles([]);
      setLoading(false);
      setHasAttemptedFetch(true);
    }
  }, [userId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const isLoading = loading || !hasAttemptedFetch;
  console.log('[useUserRoles] Returning state:', { roles, isLoading, loading, hasAttemptedFetch, error });
  
  return { roles, loading: isLoading, error, refresh: fetchRoles };
}
