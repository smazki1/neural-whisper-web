import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Wrench, ArrowLeft } from 'lucide-react';

const FreeResourcesSection = () => {
  const resources = [
    {
      type: "מאמר אחרון",
      icon: BookOpen,
      title: "5 טעויות נפוצות בשימוש ב-ChatGPT שעולות לך זמן ויעילות",
      description: "המדריך המעשי לשימוש נכון בבינה מלאכותית - למה רוב האנשים משתמשים רק ב-10% מהפוטנציאל",
      readTime: "5 דקות קריאה",
      tag: "חדש",
      color: "from-blue-500/10 to-indigo-600/10",
      tagColor: "bg-blue-500/20 text-blue-300"
    },
    {
      type: "מדריך מקיף",
      icon: Download,
      title: "ערכת ההתחלה שלך לעולם ה-AI",
      description: "35 עמודים של טיפים מעשיים, תבניות מוכנות לשימוש ורשימת כלים מומלצים - הכל בחינם",
      readTime: "PDF להורדה",
      tag: "פופולרי",
      color: "from-emerald-500/10 to-green-600/10",
      tagColor: "bg-emerald-500/20 text-emerald-300"
    },
    {
      type: "כלי חינמי",
      icon: Wrench,
      title: "מחולל פרומפטים חכם לשיווק",
      description: "כלי מותאם אישית שיעזור לך ליצור פרומפטים מקצועיים לשיווק, תוכן וכתיבה יצירתית",
      readTime: "זמין כעת",
      tag: "בלעדי",
      color: "from-purple-500/10 to-pink-600/10",
      tagColor: "bg-purple-500/20 text-purple-300"
    }
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden professional-section-bg" dir="rtl">
      <div className="section-divider"></div>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="block professional-text-primary">מרחבי השראה ולימוד</span>
          </motion.h2>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="professional-card p-8 lg:p-10 h-full relative overflow-hidden cursor-pointer">
                  
                  {/* Header */}
                  <div className="relative mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <p className="professional-text-muted text-sm font-medium">{resource.type}</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${resource.tagColor}`}>
                          {resource.tag}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-6">
                    <h3 className="text-2xl lg:text-2xl font-bold professional-text-primary leading-tight">
                      {resource.title}
                    </h3>
                    
                    <p className="professional-text-body text-base leading-relaxed">
                      {resource.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-brand-text/10">
                      <span className="professional-text-muted text-sm">{resource.readTime}</span>
                      <div className="flex items-center gap-2 professional-text-accent font-medium">
                        <span className="text-sm">בקרוב</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FreeResourcesSection;