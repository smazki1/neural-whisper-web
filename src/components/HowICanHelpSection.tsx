import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Rocket, Users } from 'lucide-react';

const HowICanHelpSection = () => {
  const helpCards = [
    {
      icon: Brain,
      title: "חשיבה אסטרטגית בעידן הדיגיטלי",
      description: "אני מלמד אותך לא רק איך להשתמש בכלי AI, אלא איך לחשוב אסטרטגית על השילוב שלהם בעסק או בחיים האישיים שלך. נבנה יחד תוכנית מותאמת אישית למטרות שלך.",
      color: "from-blue-500/20 to-blue-600/20",
      glowColor: "shadow-blue-500/20"
    },
    {
      icon: Rocket,
      title: "פתרונות מעשיים ומיידיים",
      description: "במקום תיאוריות מורכבות, אתה מקבל כלים וטכניקות שאפשר ליישם כבר היום. כל מה שאני מלמד נבדק על עצמי ועל לקוחות אמיתיים - רק מה שבאמת עובד.",
      color: "from-orange-500/20 to-red-600/20",
      glowColor: "shadow-orange-500/20"
    },
    {
      icon: Users,
      title: "הדרכה אישית ותמיכה מתמשכת",
      description: "לא נשאר לבד במסע. אני כאן לתמוך, להדריך ולענות על שאלות לאורך כל הדרך. קהילה של אנשים בדומה למצב שלך, שמחלקים ניסיון ולומדים יחד.",
      color: "from-green-500/20 to-emerald-600/20",
      glowColor: "shadow-green-500/20"
    }
  ];

  return (
    <section className="py-20 lg:py-32 relative professional-section-alt" dir="rtl">
      <div className="section-divider"></div>
      <div className="container mx-auto px-6 lg:px-8">
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
            <span className="block professional-text-primary mb-2">איך אני יכול</span>
            <span className="block professional-text-accent">לעזור לך</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl lg:text-2xl professional-text-body max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            התפתח איתנו בעידן הדיגיტלי - באופן מעשי, נעים ובלי הסיפורים המפחידים
          </motion.p>
        </motion.div>

        {/* Help Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {helpCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="professional-card p-8 lg:p-10 h-full relative overflow-hidden">
                  {/* Subtle Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <motion.div 
                    className="relative mb-8"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-all duration-500">
                      <IconComponent className="w-10 h-10 text-accent" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="relative space-y-6">
                    <h3 className="text-2xl lg:text-3xl font-bold professional-text-primary leading-tight">
                      {card.title}
                    </h3>
                    
                    <p className="professional-text-body text-lg leading-relaxed">
                      {card.description}
                    </p>

                    {/* Decorative Element */}
                    <motion.div 
                      className="w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 rounded-2xl transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg professional-text-body mb-8">
            מוכן להתחיל? בוא נתכנן יחד את השלב הבא שלך
          </p>
          <motion.button 
            className="professional-button-primary text-xl px-10 py-4"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            יאללה, בוא נתחיל
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowICanHelpSection;