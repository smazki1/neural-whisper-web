import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import { Toaster } from '@/components/ui/toaster';

const Contact = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const whatsappUrl = "https://wa.me/972542000000?text=" + encodeURIComponent("שלום אבי, אני מעוניין ליצור קשר");

  return (
    <>
      <Helmet>
        <title>יצירת קשר | AI Master - אבי פריד</title>
        <meta name="description" content="צור קשר עם אבי פריד למומחיות בבינה מלאכותית. הרצאות, סדנאות, ייעוץ אישי ופתרונות AI מותאמים אישית." />
        <meta name="keywords" content="יצירת קשר, אבי פריד, בינה מלאכותית, הרצאות, ייעוץ, סדנאות AI" />
        <meta property="og:title" content="יצירת קשר | AI Master" />
        <meta property="og:description" content="צור קשר עם אבי פריד למומחיות בבינה מלאכותית" />
      </Helmet>

      <Navbar onContactClick={() => setIsContactModalOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20">
        <motion.div 
          className="container mx-auto px-4 py-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header Section */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              בואו נתחיל לעבוד
              <span className="text-primary block mt-2">יחד</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              יש לך פרויקט מרתק? רעיון חדשני? או סתם רוצה לדבר על העתיד של הטכנולוגיה?
              <br />אני כאן כדי לעזור ולהדריך אותך בדרך.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Information */}
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Contact Details */}
              <Card className="p-8 shadow-lg border-2 border-primary/10">
                <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
                  דרכי יצירת קשר
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-lg">אימייל</p>
                      <a href="mailto:avi@ai-master.co.il" className="text-muted-foreground hover:text-primary text-lg">
                        avi@ai-master.co.il
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-lg">טלפון</p>
                      <a href="tel:+972542000000" className="text-muted-foreground hover:text-primary text-lg">
                        054-200-0000
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MessageCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-lg">וואטסאפ</p>
                      <a 
                        href="https://wa.me/972542000000" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-green-600 text-lg"
                      >
                        שלח הודעה
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-lg">מיקום</p>
                      <p className="text-muted-foreground text-lg">ישראל</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Button 
                    onClick={() => window.open(whatsappUrl, '_blank')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    שלח הודעה בוואטסאפ
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <Toaster />
    </>
  );
};

export default Contact;