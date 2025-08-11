import React from "react";
import { Button } from "@/components/ui/button";

interface Props { onPrimary: () => void }

export default function StickyMobileCTA({ onPrimary }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-xl p-3 md:hidden">
      <div className="container flex items-center justify-between gap-3">
        <div>
          <div className="text-sm">מחיר השקה</div>
          <div className="text-lg font-semibold">
            690 ₪ <span className="text-muted-foreground line-through text-sm align-middle mr-2">1,490 ₪</span>
          </div>
        </div>
        <Button size="lg" onClick={onPrimary}>להצטרפות</Button>
      </div>
    </div>
  );
}
