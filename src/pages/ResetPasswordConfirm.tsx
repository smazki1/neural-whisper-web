import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordConfirm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    
    // Token validation will be done when form is submitted
    setTokenValid(true);
  }, [token]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "הסיסמה חייבת להכיל לפחות 8 תווים";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "הסיסמה חייבת להכיל אותיות גדולות, קטנות ומספרים";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({ title: "שגיאה", description: "לינק איפוס לא תקין", variant: "destructive" });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({ title: "סיסמה לא תקינה", description: passwordError, variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "שגיאה", description: "הסיסמאות אינן תואמות", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('password-reset', {
        body: { 
          action: 'confirm', 
          token: token, 
          password: password 
        }
      });

      if (error) {
        if (error.message.includes("Invalid or expired")) {
          setTokenValid(false);
          toast({ 
            title: "לינק לא תקין", 
            description: "הלינק פג תוקפו או כבר נוצל", 
            variant: "destructive" 
          });
        } else {
          toast({ 
            title: "שגיאה", 
            description: error.message || "שגיאה באיפוס הסיסמה", 
            variant: "destructive" 
          });
        }
      } else {
        toast({ 
          title: "הסיסמה עודכנה בהצלחה", 
          description: "כעת תוכל להתחבר עם הסיסמה החדשה" 
        });
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } catch (error) {
      toast({ 
        title: "שגיאה", 
        description: "שגיאה באיפוס הסיסמה", 
        variant: "destructive" 
      });
    }

    setLoading(false);
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>Reset Password | AI Master</title>
          <meta name="description" content="Reset your AI Master account password." />
        </Helmet>

        <main className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>לינק לא תקין</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-red-600">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p>הלינק לאיפוס הסיסמה לא תקין או פג תוקפו</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  אנא בקש לינק חדש לאיפוס סיסמה
                </p>
                <div className="space-y-2">
                  <Link to="/reset-password" className="block">
                    <Button className="w-full">בקש לינק חדש</Button>
                  </Link>
                  <Link to="/auth" className="block">
                    <Button variant="outline" className="w-full">חזרה להתחברות</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Set New Password | AI Master</title>
        <meta name="description" content="Set your new AI Master account password." />
      </Helmet>

      <main className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>הגדרת סיסמה חדשה</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה חדשה</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="הכניסו סיסמה חדשה"
                  />
                  <p className="text-xs text-muted-foreground">
                    הסיסמה חייבת להכיל לפחות 8 תווים, אותיות גדולות, קטנות ומספרים
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אישור סיסמה</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="הכניסו שוב את הסיסמה החדשה"
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'מעדכן...' : 'עדכן סיסמה'}
                </Button>
              </form>
              
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

export default ResetPasswordConfirm;