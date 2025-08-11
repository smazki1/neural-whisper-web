import React from "react";
import { motion } from "framer-motion";

export default function Differentiator() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent/10 via-transparent to-accent/10" />
      <div className="container max-w-5xl px-4 md:px-6">
        <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-3xl border border-accent/30 bg-background/70 backdrop-blur-xl p-6 md:p-10">
          <h3 className="text-xl md:text-3xl font-semibold mb-4 text-right">מה מבדל את הקורס הזה מכל מה שראית עד עכשיו</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground text-base leading-relaxed">
            <p>בניגוד לעוד "קורס AI" שמלמד כלים באופן כללי, כאן תלמד איך להפוך את ה‑AI למותאם אישית לשפה, לאופי ול‑DNA הייחודי של העסק שלך, כך שתבלוט מעל כל רעש השוק ותהפוך למותג שאי אפשר להתעלם ממנו.</p>
            <p>התוצאה? AI שיודע לחשוב, לדבר ולפעול כמו העסק שלך – ולא כמו עוד מותג גנרי.</p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
