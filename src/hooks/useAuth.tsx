import { useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1) Subscribe first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      console.log('Auth state change:', event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // 2) Then get current session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      console.log('Initial session:', data.session?.user?.email);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "שגיאה בהתחברות", description: error.message, variant: "destructive" });
      return { error };
    }
    toast({ title: "ברוך הבא!" });
    return { error: null };
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });
    if (error) {
      toast({ title: "שגיאה בהרשמה", description: error.message, variant: "destructive" });
      return { error };
    }
    toast({ title: "בדוק את האימייל שלך", description: "אשר את כתובת האימייל כדי לסיים את ההרשמה." });
    return { error: null };
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      toast({ title: "שגיאה בהתחברות עם Google", description: error.message, variant: "destructive" });
      return { error };
    }
    return { error: null };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "שגיאה בהתנתקות", description: error.message, variant: "destructive" });
      return { error };
    }
    toast({ title: "התנתקת בהצלחה" });
    return { error: null };
  }, [toast]);

  return { session, user, loading, signIn, signUp, signInWithGoogle, signOut };
}
