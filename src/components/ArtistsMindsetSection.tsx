import React from 'react';
import { motion } from 'framer-motion';

const ArtistsMindsetSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/20" dir="rtl">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          className="space-y-4 text-lg lg:text-xl leading-relaxed text-brand-text text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl lg:text-3xl font-bold">אתם האומן. יש לכם חזון.</h3>
          <p>משהו שאתם רואים, משהו שרק אתם יכולים לראות.</p>
          <p>
            ה-AI הוא הכלי שלכם - המכחול, האזמל, הפטיש.<br />
            הוא לא יוצר את החזון.<br />
            אתם רואים את החזון.<br />
            אתם מחליטים.<br />
            אתם נותנים את הנשמה.
          </p>
          <p>והכלי? הוא מוריד את האבנים הכבדות מהדרך.</p>
          <p className="text-2xl lg:text-3xl font-bold text-primary">אין יותר מקום לחלומות קטנים.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtistsMindsetSection;


