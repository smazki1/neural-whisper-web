import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Users, BriefcaseBusiness, Layers3, CheckCircle2 } from "lucide-react";
import { copy } from "../content";

const iconMap = { Rocket, Users, BriefcaseBusiness, Layers3 } as const;

export default function Benefits() {
  return (
    <section className="container max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <header className="mb-8 md:mb-12 text-right">
        <h2 className="text-2xl md:text-4xl font-semibold">למה זו התוכנית שלכם לנצח את השוק</h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {copy.benefits.map((b, i) => {
          const Icon = iconMap[b.icon as keyof typeof iconMap];
          return (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <Card className="bg-card/70 border-border/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-accent" />
                    <CheckCircle2 className="h-5 w-5 text-accent/80" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
