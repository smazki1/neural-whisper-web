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
import '../index.css'; // Ensure global styles are imported

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
      <Navbar onContactClick={handleContactClick} />
      <main className="animate-fade-in">
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
