import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { copy } from "../content";

interface Props { onPrimary: () => void }

export default function Pricing({ onPrimary }: Props) {
  return (
    <section className="container max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4 text-muted-foreground text-right">
          <h4 className="text-xl md:text-2xl font-semibold text-foreground">ההשקעה שלך</h4>
          <p>גישה לכל התכנים ללא הגבלת זמן – אתה חוזר מתי שאתה רוצה, לומד בקצב שלך.</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["ליווי קהילתי תומך", "עדכוני תכנים שוטפים", "טמפלטים מוכנים לעבודה", "שיטות עבודה מוכחות"].map((li) => (
              <li key={li} className="flex items-center gap-2 justify-end">
                <span>{li}</span>
              </li>
            ))}
          </ul>
        </div>

        <Card className="bg-card/70 backdrop-blur-xl border-border/50 sticky top-24">
          <CardContent className="p-6">
            <div className="flex items-end gap-3">
              <div className="text-4xl md:text-5xl font-bold">690 ₪</div>
              <div className="text-muted-foreground line-through text-xl">1,490 ₪</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">החזר השקעה כבר ב‑3 השבועות הראשונים</p>
            <div className="mt-5 flex flex-col gap-3">
              <Button size="lg" onClick={onPrimary}>
                להירשם עכשיו
              </Button>
              <Button variant="secondary" size="lg" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                לגלול לראש העמוד
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
