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
                <span className="block premium-accent-gradient">נעים מאוד, אבי פריד</span>
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
                <strong className="text-accent">ברוכים הביאם ותודה שבאתם.</strong>
              </p>
              
              <p>
                כאן זה בית ליוצרים, יזמים ואנשי מקצוע שלא מוכנים להישאר מאחור, ומבינים שהמיומנות הקריטית ביותר היום היא לדעת איך לעבוד נכון עם AI, ולא רק להשתמש בו.
              </p>
              
              <p>
                רובנו גדלנו על ההבטחה הפשוטה: תעבוד קשה, תצבור ניסיון, ותצליח. אבל התעוררנו לעולם שבו כללי המשחק משתנים בזמן אמת, והחשש שהמומחיות שלנו תהפוך ללא רלוונטית הוא אמיתי ומשתק.
              </p>
              
              <p>
                מה אם הפתרון הוא לא לעבוד קשה יותר, אלא לחשוב אחרת? זו לא מהפכה טכנולוגית, זו מהפכה תפיסתית. הכלים החדשים זמינים לכולם, אבל היכולת להפיק מהם תוצאות יוצאות דופן היא מיומנות נרכשת.
              </p>
              
              <p>
                במקום ללמד אתכם על תוכנות ופיצ'רים, אנחנו מעניקים לכם מתודולוגיות עבודה מוכחות שיהפכו את ה-AI לעוזר אישי חכם - שותף אסטרטגי שמעצים את המומחיות שלכם ומבטיח שתישארו מובילים בתחומכם.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoAboutSection;