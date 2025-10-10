import React from 'react';
import { motion } from 'framer-motion';

const ArtistsMindsetSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-muted/30" dir="rtl">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <motion.div
          className="bg-card border-2 border-primary/20 rounded-2xl p-10 lg:p-16 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="space-y-8 text-center">
            <h3 className="text-3xl lg:text-5xl font-bold text-foreground">
              אתם האומן. יש לכם חזון.
            </h3>
            
            
            
            <div className="py-4">
              <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full" />
            </div>
            
            <div className="space-y-5 text-lg lg:text-xl text-foreground/90">
              <p>ה-AI הוא הכלי שלכם - המכחול, האזמל, הפטיש.</p>
              <p className="text-muted-foreground">הוא לא יוצר את החזון.</p>
              <div className="space-y-2 font-medium">
                <p>אתם רואים את החזון.</p>
                <p>אתם מחליטים.</p>
                <p>אתם נותנים את הנשמה.</p>
              </div>
            </div>
            
            <div className="py-4">
              <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full" />
            </div>
            
            <p className="text-xl lg:text-2xl text-muted-foreground">
              והכלי? הוא מוריד את האבנים הכבדות מהדרך.
            </p>
            
            <p className="text-3xl lg:text-4xl font-bold text-primary pt-4">
              אין יותר מקום לחלומות קטנים.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtistsMindsetSection;


