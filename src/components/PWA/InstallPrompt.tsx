import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Zap, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after 30 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !dismissed && !isInstalled) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable, dismissed, isInstalled]);

  const handleInstall = async () => {
    await installApp();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Check if user previously dismissed
  useEffect(() => {
    const wasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">התקן את האפליקציה</h3>
                    <p className="text-sm text-muted-foreground">גישה מהירה וחוויה טובה יותר</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="bg-green-500/20 p-2 rounded-full w-fit mx-auto mb-2">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">מהיר יותר</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500/20 p-2 rounded-full w-fit mx-auto mb-2">
                    <Wifi className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">עובד אופליין</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500/20 p-2 rounded-full w-fit mx-auto mb-2">
                    <Download className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">גישה מהירה</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Download className="w-4 h-4 ml-2" />
                  התקן עכשיו
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  size="sm"
                  className="px-3"
                >
                  לא עכשיו
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};