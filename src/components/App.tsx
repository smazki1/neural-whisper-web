import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';

const App = () => {
  return (
    <div className="min-h-screen bg-brand-primary">
      <Navbar />
      <Hero />
    </div>
  );
};

export default App;