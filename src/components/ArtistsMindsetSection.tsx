import React from 'react';
import { motion } from 'framer-motion';

const ArtistsMindsetSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden" dir="rtl">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-background to-muted/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Quote mark decoration */}
          <div className="absolute -top-8 right-0 text-8xl font-serif text-primary/10 select-none">״</div>
          
          {/* Main content card */}
          <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-border/50">
            <div className="space-y-6 text-center">
              {/* Opening statement */}
              <motion.h3 
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-l from-primary via-foreground to-primary bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                אתם האומן. יש לכם חזון.
              </motion.h3>
              
              <motion.p 
                className="text-xl lg:text-2xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                משהו שאתם רואים, משהו שרק אתם יכולים לראות.
              </motion.p>
              
              {/* Divider */}
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
              </div>
              
              {/* Philosophy core */}
              <motion.div 
                className="space-y-4 text-lg lg:text-xl leading-relaxed text-foreground/90 py-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <p className="font-medium">
                  ה-AI הוא הכלי שלכם - המכחול, האזמל, הפטיש.
                </p>
                <p className="text-muted-foreground italic">
                  הוא לא יוצר את החזון.
                </p>
                <div className="space-y-2 text-foreground font-semibold">
                  <p>אתם רואים את החזון.</p>
                  <p>אתם מחליטים.</p>
                  <p>אתם נותנים את הנשמה.</p>
                </div>
              </motion.div>
              
              {/* Divider */}
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
              </div>
              
              <motion.p 
                className="text-xl lg:text-2xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                והכלי? הוא מוריד את האבנים הכבדות מהדרך.
              </motion.p>
              
              {/* Closing statement */}
              <motion.p 
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent pt-6 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                viewport={{ once: true }}
              >
                אין יותר מקום לחלומות קטנים.
              </motion.p>
            </div>
          </div>
          
          {/* Quote mark decoration - closing */}
          <div className="absolute -bottom-8 left-0 text-8xl font-serif text-primary/10 select-none transform rotate-180">״</div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtistsMindsetSection;


