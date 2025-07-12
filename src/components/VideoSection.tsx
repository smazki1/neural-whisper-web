import React from 'react';
import { motion } from 'framer-motion';

const VideoSection = () => {
  return (
    <section className="py-20 font-heebo relative overflow-hidden" dir="rtl">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101933] via-[#0f1a30] to-[#101933]"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-full blur-3xl animate-premium-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/3 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Video Container with Yellow Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Yellow Accent Frame */}
          <div className="relative p-1 bg-gradient-to-r from-[#eec643] via-[#eec643]/80 to-[#eec643] rounded-2xl">
            <div className="relative bg-[#101933] rounded-xl overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://www.youtube.com/embed/14bZqkWs5ng"
                  title="הסיפור שלי, וה'למה' מאחורי המשימה"
                  className="absolute inset-0 w-full h-full rounded-xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/20 via-transparent to-[#eec643]/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection; 