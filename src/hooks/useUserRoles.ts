import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'instructor' | 'student';

export function useUserRoles(userId?: string | null) {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!userId) {
      setRoles([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    if (error) {
      setError(error.message);
      setRoles([]);
    } else {
      setRoles((data || []).map(r => r.role as AppRole));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  return { roles, loading, error, refresh: fetchRoles };
}
