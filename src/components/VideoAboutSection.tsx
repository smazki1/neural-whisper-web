import React from 'react';
import { motion } from 'framer-motion';
import aviPortrait from '@/assets/avi-fried-portrait.png';

const VideoAboutSection = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden" dir="rtl">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video Section - Left Side */}
          <motion.div 
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl modern-glow max-w-lg mx-auto">
              {/* Portrait Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-accent/10 to-primary/10">
                <img
                  src={aviPortrait}
                  alt="אבי פריד - יזם טכנולוגי ומומחה AI"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                
                {/* Subtle Gradient Overlay for professional look */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-transparent to-background/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full blur-sm" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-accent/10 rounded-full blur-md" />
          </motion.div>

          {/* Content Section - Right Side */}
          <motion.div 
            className="order-1 lg:order-2 space-y-8"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <span className="block text-brand-text mb-2">שלום, אני</span>
                <span className="block premium-accent-gradient">אבי פריד</span>
              </motion.h2>
              
              <motion.div 
                className="w-20 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </div>

            <motion.div 
              className="space-y-6 text-lg lg:text-xl leading-relaxed text-brand-text"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p>
                <strong className="text-accent">יזם טכנולוגי וחובב אדם</strong> שמאמין שכל אחד יכול להצליח בעידן הדיגיטלי - 
                גם אם הוא לא נולד עם מחשב ביד.
              </p>
              
              <p>
                <span className="text-accent font-semibold">15+ שנים</span> של ניסיון בעולמות השיווק הדיגיטלי, 
                פיתוח עסקי וחדשנות טכנולוגית. עברתי את המסע מאפס ועד בניית חברות מצליחות, 
                וכיום אני כאן כדי לחלוק איתכם את הכלים והידע שרכשתי.
              </p>
              
              <p>
                המשימה שלי פשוטה: <span className="text-accent font-semibold">להפוך את הטכנולוגיה לנגישה ומעשית</span> עבור אנשי עסקים, 
                יזמים וכל מי שרוצה להשתמש בכוח של הבינה המלאכותית כדי להשיג יותר בפחות זמן.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="modern-backdrop px-4 py-2 rounded-full">
                  <span className="text-accent font-medium">✓</span>
                  <span className="mr-2 text-brand-text-secondary">יזם מנוסה</span>
                </div>
                <div className="modern-backdrop px-4 py-2 rounded-full">
                  <span className="text-accent font-medium">✓</span>
                  <span className="mr-2 text-brand-text-secondary">מומחה AI</span>
                </div>
                <div className="modern-backdrop px-4 py-2 rounded-full">
                  <span className="text-accent font-medium">✓</span>
                  <span className="mr-2 text-brand-text-secondary">מרצה מבוקש</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-brand-text-secondary italic text-lg">
                "הטכנולוגיה לא צריכה להיות מפחידה. היא צריכה להיות כלי שמשחרר אותנו לעשות את מה שאנחנו הכי טובים בו."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoAboutSection;