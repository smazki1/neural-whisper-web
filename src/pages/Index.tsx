import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Solution from '../components/Solution';
import Outcome from '../components/Outcome';
import CTA from '../components/CTA';
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
    <div className="bg-[#101933] text-[#d8d5db] font-['Heebo']">
      <Navbar onContactClick={handleContactClick} />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Outcome />
        <CTA onContactClick={handleContactClick} />
      </main>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
      <Toaster />
    </div>
  );
}

export default Index;
