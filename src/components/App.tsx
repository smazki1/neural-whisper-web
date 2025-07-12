import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import VideoSection from './VideoSection';
import Problem from './Problem';
import Solution from './Solution';
import Outcome from './Outcome';
import CTA from './CTA';
import Footer from './Footer';
import ContactModal from './ContactModal';

const App = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleContactClose = () => {
    setIsContactModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-primary">
      <Navbar onContactClick={handleContactClick} />
      <Hero />
      <VideoSection />
      <Problem />
      <Solution />
      <Outcome />
      <CTA />
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
    </div>
  );
};

export default App;