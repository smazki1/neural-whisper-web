import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://hook.eu2.make.com/mil6u6k80s78p8i0r2y4sjccia8kegwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          timestamp: new Date().toISOString(),
          source: 'AI Master Website'
        }),
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        // Reset form and close modal
        setFormData({ name: '', email: '', message: '' });
        onClose();
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with Multiple Layers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          >
            {/* Base backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl"></div>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#101933]/80 via-[#0d1528]/60 to-[#101933]/80"></div>
            
            {/* Floating accent elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#eec643]/10 to-transparent rounded-full blur-3xl animate-premium-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/8 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '2s' }}></div>
          </motion.div>
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.320, 1] }}
              className="relative max-w-lg w-full"
              dir="rtl"
            >
              {/* Premium Glass Container */}
              <div className="relative bg-gradient-to-br from-[#101933]/95 via-[#0d1528]/90 to-[#101933]/95 backdrop-blur-2xl rounded-3xl border border-[#eec643]/30 shadow-2xl">
                {/* Premium glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/20 via-transparent to-[#eec643]/20 rounded-3xl blur-xl opacity-60"></div>
                
                {/* Inner container */}
                <div className="relative p-8 md:p-10">
                  {/* Close button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={onClose}
                    className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#eec643]/20 to-[#eec643]/10 border border-[#eec643]/30 hover:from-[#eec643]/30 hover:to-[#eec643]/20 transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5 text-[#eec643] group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>

                  {/* Header with Premium Styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                  >
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#eec643]/20 to-[#eec643]/10 rounded-2xl border border-[#eec643]/30 mb-4">
                        <svg className="w-8 h-8 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#eec643] mb-3 hebrew-mobile-wrap">
                      בואו נתחיל לעבוד יחד
                    </h2>
                    <p className="text-lg text-gray-300 hebrew-mobile-wrap">
                      ספר לנו על הפרויקט שלך ונחזור אליך תוך 24 שעות
                    </p>
                  </motion.div>

                  {/* Enhanced Form */}
                  <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Name field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label htmlFor="name" className="block text-brand-text mb-3 font-medium text-lg">
                        שם מלא
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-gradient-to-r from-[#0d1528]/60 to-[#101933]/60 border border-[#eec643]/20 rounded-xl focus:border-[#eec643] focus:outline-none focus:ring-2 focus:ring-[#eec643]/30 text-brand-text placeholder-brand-text/50 transition-all duration-300 hover:border-[#eec643]/40"
                          placeholder="הכנס את שמך המלא"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </motion.div>

                    {/* Email field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="email" className="block text-brand-text mb-3 font-medium text-lg">
                        כתובת אימייל
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-gradient-to-r from-[#0d1528]/60 to-[#101933]/60 border border-[#eec643]/20 rounded-xl focus:border-[#eec643] focus:outline-none focus:ring-2 focus:ring-[#eec643]/30 text-brand-text placeholder-brand-text/50 transition-all duration-300 hover:border-[#eec643]/40"
                          placeholder="your@email.com"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </motion.div>

                    {/* Message field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label htmlFor="message" className="block text-brand-text mb-3 font-medium text-lg">
                        ספר לנו על הפרויקט שלך
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-6 py-4 bg-gradient-to-r from-[#0d1528]/60 to-[#101933]/60 border border-[#eec643]/20 rounded-xl focus:border-[#eec643] focus:outline-none focus:ring-2 focus:ring-[#eec643]/30 text-brand-text placeholder-brand-text/50 resize-none transition-all duration-300 hover:border-[#eec643]/40"
                          placeholder="איך נוכל לעזור לך להגשים את המטרות שלך עם AI? ספר לנו על הרעיונות, האתגרים או הפרויקטים שלך..."
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#eec643]/5 to-transparent rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </motion.div>

                    {/* Submit button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full premium-button-primary text-xl py-4 group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          שלח הודעה
                          <motion.svg 
                            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 15 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </motion.svg>
                        </span>
                        
                        {/* Animated background effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#eec643]/20 to-[#eec643]/10 rounded-xl"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.button>
                    </motion.div>
                  </motion.form>
                  
                  {/* Premium Footer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 pt-6 border-t border-[#eec643]/20"
                  >
                    <div className="flex items-center justify-center gap-4 text-sm text-brand-text/60">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        מענה תוך 24 שעות
                      </div>
                      <div className="w-1 h-1 bg-[#eec643]/40 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#eec643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        מידע מוצפן ומאובטח
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal; 