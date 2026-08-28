import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const RECOVERY_CONTEXT_KEY = "ai-master-password-recovery-context";

type StoredRecoveryContext = {
  userId: string;
  expiresAt: number;
};

let trackingStarted = false;
let activeRecoveryContext: StoredRecoveryContext | null = null;

function storeRecoveryContext(session: Session) {
  const context = {
    userId: session.user.id,
    expiresAt: session.expires_at ?? Math.floor(Date.now() / 1000),
  };

  activeRecoveryContext = context;

  try {
    window.sessionStorage.setItem(RECOVERY_CONTEXT_KEY, JSON.stringify(context));
  } catch {
    // The in-memory context still protects the current page when storage is unavailable.
  }
}

function readRecoveryContext(): StoredRecoveryContext | null {
  if (activeRecoveryContext) {
    return activeRecoveryContext;
  }

  try {
    const value = window.sessionStorage.getItem(RECOVERY_CONTEXT_KEY);
    return value ? JSON.parse(value) as StoredRecoveryContext : null;
  } catch {
    return null;
  }
}

export function clearPasswordRecoveryContext() {
  activeRecoveryContext = null;

  try {
    window.sessionStorage.removeItem(RECOVERY_CONTEXT_KEY);
  } catch {
    // Nothing else is required when storage is unavailable.
  }
}

export function markPasswordRecoverySession(session: Session) {
  storeRecoveryContext(session);
}

export function hasValidPasswordRecoveryContext(session: Session | null) {
  if (!session) {
    return false;
  }

  const context = readRecoveryContext();
  const now = Math.floor(Date.now() / 1000);
  const isValid = Boolean(
    context &&
    context.userId === session.user.id &&
    context.expiresAt > now,
  );

  if (!isValid) {
    clearPasswordRecoveryContext();
  }

  return isValid;
}

export function startPasswordRecoveryTracking() {
  if (trackingStarted || typeof window === "undefined") {
    return;
  }

  trackingStarted = true;
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY" && session) {
      storeRecoveryContext(session);
    }

    if (event === "SIGNED_OUT") {
      clearPasswordRecoveryContext();
    }
  });
}
