import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroMain from "@/assets/backgrounds/hero/hero-background-16.png";
import heroAlt from "@/assets/backgrounds/hero/hero-background-18.png";

interface Props { onPrimary: () => void; onSecondary: () => void; }

export default function Hero({ onPrimary, onSecondary }: Props) {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-brand-accent/10 to-transparent rounded-full blur-3xl animate-premium-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-brand-accent/15 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }} />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-accent/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-right order-2 lg:order-1"
          >
            <div className="space-y-8">
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-brand-accent/10 border border-brand-accent/20 backdrop-blur-xl"
              >
                <span className="text-brand-accent font-medium text-sm tracking-wide">🚀 השקת הקורס החדש</span>
              </motion.div>

              {/* Main Headline */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                  <span className="block text-foreground mb-2">AI</span>
                  <span className="block premium-accent-gradient animate-premium-glow-pulse">אקסלרטור</span>
                  <span className="block text-foreground mt-2">שיווקי</span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6, duration: 0.6 }}
                className="premium-card p-8 lg:p-10"
              >
                <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-medium">
                  הקורס הדיגיטלי שישנה את הדרך שבה את.ה מנהל.ת את העסק שלך
                </p>
                <p className="mt-6 text-lg md:text-xl text-foreground/80 leading-relaxed">
                  הפכו את ה‑AI לשותף העסקי החכם, המהיר והמותאם אישית ביותר שלך – כבר בשבועות הראשונים.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-end"
              >
                <button onClick={onPrimary} className="premium-button-primary text-xl px-10 py-5 group">
                  <span className="flex items-center justify-center gap-3">
                    אני בפנים – דברו איתי
                    <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </span>
                </button>
                <button onClick={onSecondary} className="premium-button-secondary text-xl px-10 py-5">
                  לראות את הסילבוס
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative h-[500px] lg:h-[700px] order-1 lg:order-2"
          >
            {/* Main Image */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-3xl overflow-hidden premium-card shadow-2xl"
            >
              <img 
                src={heroAlt} 
                alt="תצוגה יצירתית של שיווק מבוסס AI" 
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" 
                loading="eager" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Card */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 w-[45%] h-[35%] rounded-2xl overflow-hidden premium-card shadow-xl animate-premium-float"
              style={{ animationDelay: '2s' }}
            >
              <img 
                src={heroMain} 
                alt="זרימות עבודה שיווקיות עם AI" 
                className="h-full w-full object-cover" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent" />
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent/20 to-brand-accent/5 rounded-3xl blur-xl opacity-70 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
