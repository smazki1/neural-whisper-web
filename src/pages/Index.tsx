import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Solution from '../components/Solution';
import Articles from '../components/Articles';
import ProductsSection from '../components/ProductsSection';
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
    <div className="bg-[#101933] text-[#d8d5db] font-['Heebo'] animate-fade-in">
      <Navbar onContactClick={handleContactClick} />
      <main className="animate-fade-in">
        <Hero />
        <Problem />
        <Solution />
        <Articles />
        <ProductsSection />
        <div className="text-center py-12">
          <Link 
            to="/contact" 
            className="premium-button-primary text-lg px-8 py-4 hover:scale-105 transition-transform duration-300"
          >
            צור קשר
          </Link>
        </div>
      </main>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
      <Toaster />
    </div>
  );
}

export default Index;
