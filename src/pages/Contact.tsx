import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import ContactForm from '@/components/ContactForm';
import { Toaster } from '@/components/ui/toaster';
import heroBackground from '@/assets/hero-bg-ai-modern.jpg';
import heroVideo from '@/assets/contact/avi-hero-0920-1080p.mp4';
import './contact.css';

const Contact = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stopPlayback: (() => void) | undefined;

    const startPlayback = () => {
      stopPlayback?.();
      setIsVideoPlaying(false);
      if (reducedMotion.matches) return;

      let stopped = false;
      const showFallback = () => {
        if (stopped) return;
        stopPlayback?.();
        setIsVideoPlaying(false);
      };
      const timeout = window.setTimeout(showFallback, 15000);
      const onPlaying = () => {
        if (stopped) return;
        window.clearTimeout(timeout);
        setIsVideoPlaying(true);
      };
      stopPlayback = () => {
        stopped = true;
        window.clearTimeout(timeout);
        video.removeEventListener('playing', onPlaying);
        video.removeEventListener('error', showFallback);
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
      video.addEventListener('playing', onPlaying);
      video.addEventListener('error', showFallback);
      video.muted = true;
      video.src = heroVideo;
      video.play().catch(showFallback);
    };

    startPlayback();
    reducedMotion.addEventListener('change', startPlayback);
    return () => {
      stopPlayback?.();
      reducedMotion.removeEventListener('change', startPlayback);
    };
  }, []);

  const whatsappUrl = "https://wa.me/972527772807?text=" + encodeURIComponent("שלום אבי, אני מעוניין ליצור קשר");

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
      <main className="contact-page min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20" dir="rtl">
        <section className="contact-hero" aria-labelledby="contact-title">
          <img className="contact-hero__background" src={heroBackground} alt="" />
          <video
            ref={videoRef}
            className={`contact-hero__video${isVideoPlaying ? ' is-playing' : ''}`}
            autoPlay muted loop playsInline preload="none"
            poster={heroBackground} aria-hidden="true" tabIndex={-1}
          />
          <div className="contact-hero__shade" aria-hidden="true" />
          <div className="contact-hero__content">
            <h1 id="contact-title">בואו נתחיל לעבוד יחד</h1>
            <p>יש לכם פרויקט מרתק? רעיון חדשני? או סתם רוצים לדבר על העתיד של הטכנולוגיה?</p>
          </div>
        </section>

        <section className="contact-methods container mx-auto px-4" aria-labelledby="contact-methods-title">
          <Card className="contact-methods__card shadow-lg border-2 border-primary/10">
            <h2 id="contact-methods-title" className="text-2xl font-semibold text-foreground text-center">
              דרכי יצירת קשר
            </h2>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-methods__whatsapp">
              <MessageCircle className="w-6 h-6" aria-hidden="true" />
              שלחו הודעה בוואטסאפ
            </a>
            <div className="contact-methods__details">
              <a href="tel:+972527772807" className="contact-methods__link">
                <Phone className="w-6 h-6" aria-hidden="true" />
                <span><span className="contact-methods__label">טלפון</span><span dir="ltr">052-777-2807</span></span>
              </a>
              <a href="mailto:avi@ai-master.co.il" className="contact-methods__link">
                <Mail className="w-6 h-6" aria-hidden="true" />
                <span><span className="contact-methods__label">אימייל</span><span dir="ltr">avi@ai-master.co.il</span></span>
              </a>
            </div>
          </Card>
        </section>
        <ContactForm
          description="מלאו את הפרטים ונחזור אליכם בהקדם:"
          source="טופס יצירת קשר"
        />
      </main>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <Toaster />
    </>
  );
};

export default Contact;
