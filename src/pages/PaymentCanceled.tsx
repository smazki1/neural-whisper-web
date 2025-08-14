import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

const PaymentCanceled = () => {
  return (
    <>
      <Helmet>
        <title>תשלום בוטל | AI Master</title>
        <meta name="description" content="התשלום בוטל. אתה יכול לנסות שוב או לחזור למוצרים" />
      </Helmet>

      <div className="min-h-screen bg-background pt-20" dir="rtl">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Canceled Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                התשלום בוטל
              </h1>
              <p className="text-xl text-muted-foreground">
                ההזמנה שלך לא הושלמה
              </p>
            </div>

            {/* Information Card */}
            <Card className="mb-8">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-lg font-semibold">מה קרה?</h3>
                <p className="text-muted-foreground">
                  התשלום בוטל לפי בקשתך או בגלל שגיאה בתהליך. לא נגבה כסף מחשבון הבנק שלך.
                </p>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">סיבות אפשריות לביטול:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 text-right">
                    <li>• לחצת על "ביטול" בעמוד התשלום</li>
                    <li>• סגרת את החלון לפני השלמת התשלום</li>
                    <li>• הייתה בעיה טכנית בתהליך התשלום</li>
                    <li>• פרטי כרטיס האשראי לא תקינים</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/products">
                    <RefreshCw className="h-4 w-4 ml-2" />
                    נסה שוב
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/products">
                    <ArrowRight className="h-4 w-4 ml-2" />
                    חזרה למוצרים
                  </Link>
                </Button>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-12 pt-8 border-t">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  זקוק לעזרה?
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  אם אתה נתקל בבעיות בתשלום או צריך סיוע, אנחנו כאן לעזור!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <a 
                    href="mailto:support@aimaster.co.il" 
                    className="text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    support@aimaster.co.il
                  </a>
                  <span className="hidden sm:inline text-blue-600">•</span>
                  <a 
                    href="tel:+972-50-123-4567" 
                    className="text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    050-123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCanceled;