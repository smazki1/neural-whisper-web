import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  clearPasswordRecoveryContext,
  hasValidPasswordRecoveryContext,
  markPasswordRecoverySession,
} from "@/lib/passwordRecoveryContext";
import { consumeInitialPasswordRecoveryRedirect } from "@/lib/authRedirectIntent.js";
import {
  completePasswordRecovery,
  resolveInitialRecoveryStatus,
  resolveRecoveryEventStatus,
} from "@/lib/passwordRecoveryFlow.js";
import { validatePasswordChange } from "@/lib/passwordValidation.js";

type PageStatus = "checking" | "ready" | "invalid";

const passwordErrorMessages: Record<string, string> = {
  too_short: "הסיסמה חייבת להכיל לפחות 8 תווים.",
  missing_uppercase: "הסיסמה חייבת להכיל לפחות אות גדולה אחת.",
  missing_lowercase: "הסיסמה חייבת להכיל לפחות אות קטנה אחת.",
  missing_number: "הסיסמה חייבת להכיל לפחות מספר אחד.",
  mismatch: "הסיסמאות אינן זהות.",
};

function clearAuthCallbackUrl() {
  window.history.replaceState(window.history.state, "", window.location.pathname);
}

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<PageStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (resolveRecoveryEventStatus(event, session) === "ready" && session) {
        markPasswordRecoverySession(session);

        if (mounted) {
          setStatus("ready");
        }
      }
    });

    const checkExistingSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      clearAuthCallbackUrl();

      if (!mounted) {
        return;
      }

      const initialStatus = resolveInitialRecoveryStatus({
        session: data.session,
        sessionError: error,
        hasRecoveryContext: hasValidPasswordRecoveryContext(data.session),
        hasRecoveryRedirect: consumeInitialPasswordRecoveryRedirect(),
      });

      setStatus((currentStatus) =>
        currentStatus === "ready" ? "ready" : initialStatus,
      );
    };

    void checkExistingSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const validationError = validatePasswordChange(password, confirmation);
    if (validationError) {
      setFormError(passwordErrorMessages[validationError]);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!hasValidPasswordRecoveryContext(sessionData.session)) {
      setStatus("invalid");
      return;
    }

    setSubmitting(true);
    const recoveryResult = await completePasswordRecovery(supabase.auth, password);

    if (recoveryResult === "update_error") {
      setSubmitting(false);
      setFormError("לא ניתן לעדכן את הסיסמה. ייתכן שקישור האיפוס פג תוקף.");
      return;
    }

    if (recoveryResult === "sign_out_error") {
      setSubmitting(false);
      setFormError("הסיסמה עודכנה, אך לא ניתן היה לסיים את Session האיפוס בבטחה.");
      return;
    }

    clearPasswordRecoveryContext();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Set New Password | AI Master</title>
        <meta name="description" content="Set a new password for your AI Master account." />
        <link rel="canonical" href="https://ai-master.co.il/update-password" />
      </Helmet>

      <main className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>בחירת סיסמה חדשה</CardTitle>
            </CardHeader>
            <CardContent>
              {status === "checking" && (
                <p role="status" className="text-center text-sm text-muted-foreground">
                  מאמת את קישור האיפוס...
                </p>
              )}

              {status === "invalid" && (
                <div role="alert" className="space-y-4 text-center">
                  <p className="font-medium text-destructive">
                    קישור האיפוס חסר, פג תוקף או אינו תקין.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    יש לבקש קישור חדש לאיפוס הסיסמה.
                  </p>
                  <Link to="/reset-password" className="block">
                    <Button className="w-full">בקשת קישור חדש</Button>
                  </Link>
                </div>
              )}

              {status === "ready" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">סיסמה חדשה</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      לפחות 8 תווים, אות גדולה, אות קטנה ומספר.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-confirmation">אישור סיסמה</Label>
                    <Input
                      id="password-confirmation"
                      type="password"
                      value={confirmation}
                      onChange={(event) => setConfirmation(event.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-sm text-destructive">
                      {formError}
                    </p>
                  )}

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "מעדכן..." : "עדכון סיסמה"}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link to="/auth" className="text-sm underline text-muted-foreground">
                  חזרה להתחברות
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UpdatePassword;
