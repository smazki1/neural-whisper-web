import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroMain from "@/assets/backgrounds/hero/hero-background-16.png";
import heroAlt from "@/assets/backgrounds/hero/hero-background-18.png";

interface Props { onPrimary: () => void; onSecondary: () => void; }

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Hero({ onPrimary, onSecondary }: Props) {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute -right-20 -top-28 h-96 w-96 rounded-[40px] bg-primary/15 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-[420px] w-[420px] rounded-[48px] bg-accent/15 blur-3xl" />
      </div>

      <div className="container max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-right">
            <div className="mx-auto rounded-3xl bg-card/70 border border-border/60 backdrop-blur-xl p-6 md:p-10 shadow-lg">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                AI אקסלרטור שיווקי
              </h1>
              <p className="mt-4 text-muted-foreground text-lg md:text-xl">
                הקורס הדיגיטלי שישנה את הדרך שבה את.ה מנהל.ת את העסק שלך
              </p>
              <p className="mt-5 text-base md:text-lg text-foreground/80">
                הפכו את ה‑AI לשותף העסקי החכם, המהיר והמותאם אישית ביותר שלך – כבר בשבועות הראשונים.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <Button size="lg" onClick={onPrimary} className="shadow-md">
                  אני בפנים – דברו איתי
                </Button>
                <Button variant="secondary" size="lg" onClick={onSecondary}>
                  לראות את הסילבוס
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="relative h-[360px] md:h-[520px]">
            <div className="absolute left-0 right-0 mx-auto w-[86%] h-[82%] rounded-3xl overflow-hidden border border-border/50 bg-card shadow-xl">
              <img src={heroAlt} alt="תצוגה יצירתית של שיווק מבוסס AI" className="h-full w-full object-cover" loading="eager" />
            </div>
            <div className="absolute -right-2 bottom-0 w-[56%] h-[46%] rounded-2xl overflow-hidden border border-border/40 bg-card/80 shadow-md">
              <img src={heroMain} alt="זרימות עבודה שיווקיות עם AI" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
