import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (!error) {
        const to = location.state?.from?.pathname || '/';
        navigate(to, { replace: true });
      }
    } else {
      await signUp(email, password);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Login or Sign Up | AI Master</title>
        <meta name="description" content="Login or create your account to access AI Master courses and admin tools." />
        <link rel="canonical" href="https://ai-master.co.il/auth" />
      </Helmet>

      <main className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{mode === 'signin' ? 'התחברות' : 'הרשמה'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'מבצע...' : (mode === 'signin' ? 'התחבר' : 'הרשם')}
                </Button>
              </form>
              
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">או</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full mt-4"
                >
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  התחבר עם Google
                </Button>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm">
                <button className="underline" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                  {mode === 'signin' ? 'אין לכם חשבון? הרשמו' : 'כבר רשומים? התחברו'}
                </button>
                <Link to="/" className="underline">חזרה לדף הבית</Link>
              </div>
              
              {mode === 'signin' && (
                <div className="mt-4 text-center">
                  <Link to="/reset-password" className="text-sm underline text-muted-foreground">
                    שכחת סיסמה?
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Auth;
