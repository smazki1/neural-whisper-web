import React from 'react';
import { motion } from 'framer-motion';

const Problem = () => {
  return (
    <section className="py-16 md:py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="premium-card p-6 md:p-8 lg:p-12 relative group"
        >
          {/* Premium Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/10 via-transparent to-[#eec643]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 leading-snug sm:leading-tight text-center hebrew-mobile-wrap"
          >
            אם ניסית לעבוד עם כלי AI וקיבלת תוצאות רובוטיות, או שאתה פשוט{' '}
            <span className="text-[#eec643] font-bold">לא יודע מאיפה להתחיל</span>
            {' '}- אתה לא לבד.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed text-center"
          >
            <p className="px-2 sm:px-4 hebrew-mobile-wrap">
              יש פער עצום בין ההבטחה של מהפכת ה-AI לבין המציאות. אתה רואה אנשים עובדים עם הכלים האלו ומגיעים לתוצאות פורצות דרך, שומע על זה בחדשות וברשתות, ומרגיש שאתה{' '}
              <span className="text-[#eec643] font-semibold">עומד במקום בזמן שהעולם דוהר קדימה</span>.
            </p>
            
            <p className="px-2 sm:px-4 hebrew-mobile-wrap">
              מה שעוצר אותך הוא לא המחסום הטכנולוגי. זה משהו הרבה יותר עמוק. זה{' '}
              <span className="text-[#eec643] font-semibold">הפחד שלא תדע איך לגרום ל-AI להבין אותך</span>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;