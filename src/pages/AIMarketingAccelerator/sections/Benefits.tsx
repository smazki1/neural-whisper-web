import React from "react";
import { motion } from "framer-motion";
import { Rocket, Users, BriefcaseBusiness, Layers3, CheckCircle2, Sparkles } from "lucide-react";
import { copy } from "../content";

const iconMap = { Rocket, Users, BriefcaseBusiness, Layers3 } as const;

export default function Benefits() {
  return (
    <section className="relative py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-brand-accent/5 to-transparent rounded-full blur-3xl" />
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
            <Sparkles className="w-8 h-8 text-brand-accent animate-premium-glow-pulse" />
            <span className="text-brand-accent font-bold text-lg tracking-wide">יתרונות התוכנית</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="block text-foreground">למה זו התוכנית</span>
            <span className="block premium-accent-gradient mt-2">שלכם לנצח את השוק</span>
          </h2>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {copy.benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Card */}
                <div className="premium-card p-8 h-full relative overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="p-3 rounded-2xl bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-brand-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-brand-accent/60 group-hover:bg-brand-accent animate-pulse" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground group-hover:text-brand-accent transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg group-hover:text-foreground/80 transition-colors duration-300">
                      {benefit.text}
                    </p>
                  </div>

                  {/* Check Mark */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CheckCircle2 className="w-6 h-6 text-brand-accent" />
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-brand-accent/0 group-hover:border-brand-accent/30 transition-colors duration-500" />
                </div>

                {/* External Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-accent/10 to-brand-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="premium-card p-8 md:p-12 inline-block">
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              מוכנים לראות איך זה עובד בפועל?
            </p>
            <div className="flex items-center justify-center gap-3 text-brand-accent font-bold text-lg">
              <span>גלה למטה</span>
              <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
