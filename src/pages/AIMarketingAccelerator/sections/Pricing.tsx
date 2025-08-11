import React from "react";
import { motion } from "framer-motion";
import { Check, Crown, Timer, Shield, Zap } from "lucide-react";

interface Props { onPrimary: () => void }

const benefits = [
  "ליווי קהילתי תומך",
  "עדכוני תכנים שוטפים", 
  "טמפלטים מוכנים לעבודה",
  "שיטות עבודה מוכחות"
];

export default function Pricing({ onPrimary }: Props) {
  return (
    <section className="relative py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-accent/5" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-brand-accent/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-brand-accent animate-premium-glow-pulse" />
            <span className="text-brand-accent font-bold text-lg tracking-wide">השקעה חכמה</span>
          </div>
          <h4 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="block text-foreground">ההשקעה</span>
            <span className="block premium-accent-gradient mt-2">שלך</span>
          </h4>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Benefits Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-8 text-right"
          >
            {/* Value Proposition */}
            <div className="premium-card p-8 md:p-12">
              <h5 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                גישה לכל התכנים ללא הגבלת זמן
              </h5>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                אתה חוזר מתי שאתה רוצה, לומד בקצב שלך, ומקבל עדכונים שוטפים ללא תשלום נוסף.
              </p>

              {/* Benefits List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 justify-end group"
                  >
                    <span className="text-lg md:text-xl text-foreground group-hover:text-brand-accent transition-colors duration-300">
                      {benefit}
                    </span>
                    <div className="p-2 rounded-lg bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-colors duration-300">
                      <Check className="w-5 h-5 text-brand-accent" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="premium-card p-8 border-2 border-brand-accent/30"
            >
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-brand-accent" />
                <h6 className="text-xl md:text-2xl font-bold text-brand-accent">ערבות החזר כספי</h6>
              </div>
              <p className="text-lg text-muted-foreground">
                החזר השקעה מובטח כבר ב‑3 השבועות הראשונים או שתקבל את כספך בחזרה
              </p>
            </motion.div>
          </motion.div>

          {/* Pricing Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.95 }} 
            whileInView={{ opacity: 1, x: 0, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="sticky top-24"
          >
            <div className="premium-card p-8 md:p-10 relative overflow-hidden group">
              {/* Premium Badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-brand-accent to-brand-accent/80 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-brand-primary" />
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 left-8 w-16 h-16 border border-brand-accent rounded-full" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border border-brand-accent rounded-full" />
              </div>

              <div className="relative z-10">
                {/* Timer Badge */}
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <Timer className="w-5 h-5 text-brand-accent" />
                  <span className="text-brand-accent font-bold">מחיר השקה מיוחד</span>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-end justify-center gap-4 mb-2">
                    <div className="text-5xl md:text-6xl font-black text-brand-accent">690</div>
                    <div className="text-2xl md:text-3xl text-muted-foreground line-through pb-2">1,490</div>
                    <div className="text-xl text-foreground pb-2">₪</div>
                  </div>
                  <div className="text-brand-accent font-bold text-lg mb-4">חיסכון של 800 ₪!</div>
                  <p className="text-muted-foreground">תשלום חד פעמי - גישה לכל החיים</p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={onPrimary}
                    className="w-full premium-button-primary text-xl py-6 group"
                  >
                    <span className="flex items-center justify-center gap-3">
                      להירשם עכשיו
                      <Zap className="w-6 h-6 group-hover:animate-pulse" />
                    </span>
                  </button>
                  
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full premium-button-secondary text-lg py-4"
                  >
                    לגלול לראש העמוד
                  </button>
                </div>

                {/* Bottom Note */}
                <div className="mt-8 pt-6 border-t border-brand-accent/20 text-center">
                  <p className="text-sm text-muted-foreground">
                    💳 תשלום מאובטח | 🔒 SSL מוצפן
                  </p>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Border Glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-brand-accent/0 group-hover:border-brand-accent/40 transition-colors duration-500" />
            </div>

            {/* External Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent/20 to-brand-accent/10 rounded-3xl opacity-60 blur-xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
