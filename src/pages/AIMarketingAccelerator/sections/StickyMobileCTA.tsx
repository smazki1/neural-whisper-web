import React from "react";
import { motion } from "framer-motion";
import { Zap, Crown } from "lucide-react";

interface Props { onPrimary: () => void }

export default function StickyMobileCTA({ onPrimary }: Props) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
    >
      <div className="premium-card rounded-none border-x-0 border-b-0 border-t-2 border-brand-accent/30 bg-background/95 backdrop-blur-xl p-4">
        <div className="container flex items-center justify-between gap-4">
          {/* Price Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-accent/10">
              <Crown className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <div className="text-xs text-brand-accent font-bold">מחיר השקה מיוחד</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-brand-accent">690 ₪</span>
                <span className="text-muted-foreground line-through text-sm">1,490 ₪</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onPrimary}
            className="premium-button-primary px-6 py-3 text-lg group min-w-[140px]"
          >
            <span className="flex items-center justify-center gap-2">
              להצטרפות
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
            </span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-brand-accent/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ duration: 2, delay: 1.5 }}
            className="h-full bg-gradient-to-r from-brand-accent to-brand-accent/80 rounded-full"
          />
        </div>
        <div className="mt-1 text-xs text-center text-muted-foreground">
          🔥 25% נמכרו כבר | מוגבל לזמן קצר
        </div>
      </div>
    </motion.div>
  );
}
