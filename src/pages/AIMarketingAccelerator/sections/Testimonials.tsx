import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { copy } from "../content";

export default function Testimonials() {
  return (
    <section className="container max-w-6xl px-4 md:px-6 py-12 md:py-20">
      <header className="mb-6 md:mb-10 text-right">
        <h3 className="text-2xl md:text-4xl font-semibold">מה אומרים הבוגרים</h3>
      </header>
      <Carousel className="relative">
        <CarouselContent>
          {copy.testimonials.map((quote, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full bg-card/70 backdrop-blur-xl">
                <CardContent className="p-6 flex h-full items-start">
                  <p className="text-sm leading-7 text-muted-foreground">{quote}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </section>
  );
}
