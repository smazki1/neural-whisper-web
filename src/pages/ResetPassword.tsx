import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('password-reset', {
        body: { email, action: 'request' }
      });

      if (error) {
        toast({ 
          title: "שגיאה", 
          description: error.message || "שגיאה בשליחת לינק איפוס", 
          variant: "destructive" 
        });
      } else {
        setSent(true);
        toast({ 
          title: "נשלח בהצלחה", 
          description: "אם כתובת האימייל קיימת, נשלח לך לינק לאיפוס סיסמה" 
        });
      }
    } catch (error) {
      toast({ 
        title: "שגיאה", 
        description: "שגיאה בשליחת לינק איפוס", 
        variant: "destructive" 
      });
    }

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
                      placeholder="הכנס את כתובת האימייל שלך"
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
                    <p>נשלח לינק לאיפוס סיסמה!</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    בדוק את תיבת האימייל שלך ולחץ על הלינק לאיפוס הסיסמה. הלינק תקף למשך שעה אחת.
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