import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, BookOpen, PlayCircle } from "lucide-react";
import { copy } from "../content";

export default function Syllabus() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section id="syllabus" className="relative py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-brand-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-tl from-brand-accent/10 to-transparent rounded-full blur-3xl" />
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
            <BookOpen className="w-8 h-8 text-brand-accent animate-premium-glow-pulse" />
            <span className="text-brand-accent font-bold text-lg tracking-wide">תוכן הקורס</span>
          </div>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="block text-foreground">נושאים</span>
            <span className="block premium-accent-gradient mt-2">מרכזיים</span>
          </h3>
          <p className="text-xl md:text-2xl text-muted-foreground mt-6 leading-relaxed max-w-3xl">
            10 פרקים מעמיקים שיעניקו לך את כל הכלים לשליטה מלאה ב-AI עבור העסק שלך
          </p>
        </motion.div>

        {/* Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {copy.topics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="premium-card overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                {/* Trigger */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-8 py-8 text-right flex items-center justify-between group-hover:bg-brand-accent/5 transition-colors duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-accent/10 text-brand-accent font-bold text-sm">
                        {index + 1}
                      </div>
                      <PlayCircle className="w-5 h-5 text-brand-accent/70" />
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-brand-accent transition-colors duration-300">
                      {topic.title}
                    </h4>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: openItem === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mr-4"
                  >
                    <ChevronDown className="w-6 h-6 text-brand-accent" />
                  </motion.div>
                </button>

                {/* Content */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openItem === index ? "auto" : 0,
                    opacity: openItem === index ? 1 : 0
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8">
                    <div className="pt-4 border-t border-brand-accent/20">
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {topic.details}
                      </p>
                      
                      {/* Duration Badge */}
                      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20">
                        <PlayCircle className="w-4 h-4 text-brand-accent" />
                        <span className="text-brand-accent font-medium text-sm">30-45 דקות</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-brand-accent/0 group-hover:border-brand-accent/20 transition-colors duration-500 pointer-events-none" />
              </div>

              {/* External Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-accent/5 to-brand-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-20"
        >
          <div className="premium-card p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-black text-brand-accent mb-2">10</div>
                <div className="text-lg md:text-xl text-muted-foreground">פרקים מעמיקים</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-brand-accent mb-2">7+</div>
                <div className="text-lg md:text-xl text-muted-foreground">שעות תוכן איכותי</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-brand-accent mb-2">∞</div>
                <div className="text-lg md:text-xl text-muted-foreground">גישה ללא הגבלה</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
