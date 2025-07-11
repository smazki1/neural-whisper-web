import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Solution from '../components/Solution';
import Outcome from '../components/Outcome';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-brand-primary">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Outcome />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
