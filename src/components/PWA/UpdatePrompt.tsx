import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

export const UpdatePrompt = () => {
  const { swUpdate, updateSW } = usePWA();

  const handleUpdate = () => {
    updateSW();
  };

  return (
    <AnimatePresence>
      {swUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-blue-500/20 shadow-xl backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-full">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">עדכון זמין</h3>
                    <p className="text-sm text-muted-foreground">גרסה חדשה של האפליקציה זמינה</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  עדכן
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};