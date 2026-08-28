import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ResetPasswordConfirm = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Expired Password Reset Link | AI Master</title>
        <meta name="description" content="Request a new AI Master password reset link." />
      </Helmet>

      <main className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>הקישור הישן אינו תקף</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                מטעמי אבטחה, קישורים ממנגנון האיפוס הקודם אינם ניתנים לשימוש.
                יש לבקש קישור חדש.
              </p>
              <Link to="/reset-password" className="block">
                <Button className="w-full">
                  בקשת קישור חדש
                </Button>
              </Link>
              <div>
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

export default ResetPasswordConfirm;
