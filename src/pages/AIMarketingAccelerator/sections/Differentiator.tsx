import React from "react";
import { motion } from "framer-motion";
import { Star, Zap, Target } from "lucide-react";

export default function Differentiator() {
  return (
    <section className="relative py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 via-transparent to-brand-accent/10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-brand-accent/10 to-transparent rounded-full blur-3xl animate-premium-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-brand-accent/5 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container max-w-6xl px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main Card */}
          <div className="premium-card p-10 md:p-16 lg:p-20 relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-8 right-8 w-20 h-20 border-2 border-brand-accent rounded-full" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border border-brand-accent rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-brand-accent/50 rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-right">
              {/* Header */}
              <div className="mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <Star className="w-8 h-8 text-brand-accent animate-premium-glow-pulse" />
                  <span className="text-brand-accent font-bold text-lg tracking-wide">מה מייחד אותנו</span>
                </div>
                
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">
                  <span className="block text-foreground">מה מבדל את הקורס הזה</span>
                  <span className="block premium-accent-gradient mt-2">מכל מה שראית עד עכשיו</span>
                </h3>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left Column */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-brand-accent/10 mt-1">
                      <Zap className="w-6 h-6 text-brand-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
                        לא עוד "קורס AI" גנרי
                      </h4>
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        בניגוד לעוד "קורס AI" שמלמד כלים באופן כללי, כאן תלמד איך להפוך את ה‑AI למותאם אישית לשפה, לאופי ול‑DNA הייחודי של העסק שלך.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-brand-accent/10 mt-1">
                      <Target className="w-6 h-6 text-brand-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
                        התוצאה המושלמת
                      </h4>
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        AI שיודע לחשוב, לדבר ולפעול כמו העסק שלך – ולא כמו עוד מותג גנרי. תבלוט מעל כל רעש השוק ותהפוך למותג שאי אפשר להתעלם ממנו.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Quote */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-16 pt-12 border-t border-brand-accent/20"
              >
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-center premium-text-gradient leading-tight">
                  "הזמן שלך יקר מדי כדי לבזבז אותו על AI שלא מבין אותך"
                </blockquote>
              </motion.div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl border border-brand-accent/0 group-hover:border-brand-accent/30 transition-colors duration-700" />
          </div>

          {/* External Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent/10 to-brand-accent/5 rounded-3xl opacity-60 blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
