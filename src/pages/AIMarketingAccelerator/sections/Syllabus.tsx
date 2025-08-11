import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { copy } from "../content";

export default function Syllabus() {
  return (
    <section id="syllabus" className="container max-w-6xl px-4 md:px-6 py-12 md:py-20">
      <header className="mb-6 md:mb-10 text-right">
        <h3 className="text-2xl md:text-4xl font-semibold">נושאים מרכזיים</h3>
      </header>
      <Accordion type="single" collapsible className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {copy.topics.map((t, i) => (
          <AccordionItem key={t.title} value={`item-${i}`} className="border-border/40 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-5 py-4 hover:bg-muted/30 text-right">{t.title}</AccordionTrigger>
            <AccordionContent className="px-5 pb-5 text-muted-foreground leading-relaxed">{t.details}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
