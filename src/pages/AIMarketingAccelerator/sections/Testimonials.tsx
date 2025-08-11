import React from "react";
import { motion } from "framer-motion";
import { Quote, Star, Users } from "lucide-react";
import { copy } from "../content";

export default function Testimonials() {
  return (
    <section className="relative py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-brand-accent/5 to-transparent rounded-full blur-3xl animate-premium-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-brand-accent/10 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-right mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-brand-accent animate-premium-glow-pulse" />
            <span className="text-brand-accent font-bold text-lg tracking-wide">חוות דעת</span>
          </div>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="block text-foreground">מה אומרים</span>
            <span className="block premium-accent-gradient mt-2">הבוגרים</span>
          </h3>
          <p className="text-xl md:text-2xl text-muted-foreground mt-6 leading-relaxed max-w-3xl">
            תוצאות אמיתיות מאנשים אמיתיים שכבר העצימו את העסק שלהם עם AI
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {copy.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Testimonial Card */}
              <div className="premium-card p-8 md:p-10 h-full relative overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                {/* Background Pattern */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <Quote className="w-16 h-16 text-brand-accent" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 0.3 }}
                    >
                      <Star className="w-5 h-5 text-brand-accent fill-current" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 relative z-10 group-hover:text-foreground/90 transition-colors duration-300">
                  {testimonial}
                </blockquote>

                {/* Profile */}
                <div className="flex items-center gap-4 justify-end relative z-10">
                  <div className="text-right">
                    <div className="font-bold text-foreground mb-1">לקוח מרוצה</div>
                    <div className="text-sm text-brand-accent">בוגר הקורס</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-accent/20 to-brand-accent/40 flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-accent" />
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Border Glow */}
                <div className="absolute inset-0 rounded-2xl border border-brand-accent/0 group-hover:border-brand-accent/30 transition-colors duration-500" />
              </div>

              {/* External Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-accent/10 to-brand-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="premium-card p-8 md:p-12 inline-block">
            <div className="flex items-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-accent mb-2">98%</div>
                <div className="text-muted-foreground font-medium">שביעות רצון</div>
              </div>
              <div className="w-px h-12 bg-brand-accent/20" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-accent mb-2">500+</div>
                <div className="text-muted-foreground font-medium">בוגרים מרוצים</div>
              </div>
              <div className="w-px h-12 bg-brand-accent/20" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-accent mb-2">4.9</div>
                <div className="text-muted-foreground font-medium">דירוג ממוצע</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
