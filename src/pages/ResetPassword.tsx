import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { requestPasswordReset } from "@/lib/passwordResetRequest.js";

const ResetPassword: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const genericSuccessMessage =
    "אם כתובת המייל קיימת במערכת, נשלח אליה קישור לאיפוס הסיסמה.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await requestPasswordReset(supabase.auth, email, {
        redirectTo: `${window.location.origin}/update-password`
      });

      if (error) {
        console.error("Supabase Auth password reset request failed");
      }
    } catch {
      console.error("Supabase Auth password reset request failed");
    }

    setSent(true);
    toast({
      title: "בקשת האיפוס התקבלה",
      description: genericSuccessMessage
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Reset Password | AI Master</title>
        <meta name="description" content="Reset your AI Master account password." />
        <link rel="canonical" href="https://ai-master.co.il/reset-password" />
      </Helmet>

      <main className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>איפוס סיסמה</CardTitle>
            </CardHeader>
            <CardContent>
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">כתובת אימייל</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      placeholder="הכניסו את כתובת האימייל שלכם"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'שולח...' : 'שלח לינק איפוס'}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-green-600">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>{genericSuccessMessage}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    בדקו את תיבת האימייל ואת תיקיית הספאם.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSent(false); setEmail(''); }}
                    className="w-full"
                  >
                    שלח שוב
                  </Button>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Link to="/auth" className="text-sm underline">
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

export default ResetPassword;
