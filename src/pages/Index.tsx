import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import VideoAboutSection from '../components/VideoAboutSection';
import HowICanHelpSection from '../components/HowICanHelpSection';
import FreeResourcesSection from '../components/FreeResourcesSection';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { Toaster } from '@/components/ui/toaster';
import { SEOHead } from '@/components/SEO/SEOHead';
import '../index.css';

function Index() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleContactClose = () => {
    setIsContactModalOpen(false);
  };

  return (
    <div className="bg-background text-foreground font-heebo animate-fade-in">
      <SEOHead 
        title="AI Master - לחשוב עם AI - העצמה מקצועית ויעילות בעסקים"
        description="הפוך את הרעיונות שלך למציאות עם בינה מלאכותית. סדנאות, קורסים וייעוץ אישי לבעלי מקצוע, עסקים, חברות וארגונים"
      />
      <Navbar onContactClick={handleContactClick} />
      <main id="main-content" className="animate-fade-in">
        <Hero />
        <VideoAboutSection />
        <HowICanHelpSection />
        <FreeResourcesSection />
      </main>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
      <Toaster />
    </div>
  );
}

export default Index;
