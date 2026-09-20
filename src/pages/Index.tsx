import React, { lazy, Suspense, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import VideoHero from '../components/experiments/VideoHero';
import VideoAboutSection from '../components/VideoAboutSection';
import HowICanHelpSection from '../components/HowICanHelpSection';
import ProductsSection from '../components/ProductsSection';
import FreeResourcesSection from '../components/FreeResourcesSection';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { Toaster } from '@/components/ui/toaster';
import { SEOHead } from '@/components/SEO/SEOHead';
import '../index.css';

const HomepageMotion = lazy(() => import('../components/experiments/homepage/HomepageMotion'));
const DirectionSection = lazy(() => import('../components/experiments/homepage/DirectionSection'));
const Testimonials = lazy(() => import('../components/experiments/homepage/Testimonials'));
const Catalogs = lazy(() => import('../components/experiments/homepage/Catalogs'));

function Index() {
  // The approved homepage is public; the original remains available for local comparison.
  const videoExperiment = !import.meta.env.DEV || new URLSearchParams(window.location.search).get('hero') === 'video';
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleContactClose = () => {
    setIsContactModalOpen(false);
  };

  return (
    <div className={`bg-background text-foreground font-heebo ${videoExperiment ? '' : 'animate-fade-in'}`}>
      <SEOHead 
        title="AI Master – הפוך את ה-AI לשותף שלך"
        description="רעיונות, מדריכים וכלים לשימוש אמיתי בבינה מלאכותית. למד איך להפוך את ה-AI מכלי טכנולוגי לשותף שחושב איתך."
      />
      <Navbar onContactClick={handleContactClick} hideAbout={videoExperiment} />
      {import.meta.env.DEV && videoExperiment && ['demo', 'single', 'multiple', 'empty'].includes(new URLSearchParams(location.search).get('catalog') ?? '') && <div className="home-preview-note" role="note">המחשה מקומית בלבד. קטלוג הארגונים משתמש בתכנים מהעמוד הקיים; במצב ריבוי כרטיסים הקורס משוכפל לצורך בדיקת התצוגה.</div>}
      <main id="main-content" className={videoExperiment ? undefined : "animate-fade-in"} style={videoExperiment ? { paddingTop: 80 } : undefined}>
        {videoExperiment ? <VideoHero /> : <Hero />}
        <VideoAboutSection videoExperiment={videoExperiment} />
        {videoExperiment ? <Suspense fallback={null}>
          <Testimonials />
          <DirectionSection />
          <Catalogs />
          <HomepageMotion />
        </Suspense> : <>
          <HowICanHelpSection />
          <FreeResourcesSection />
          <ProductsSection />
        </>}
      </main>
      <Footer showVault={videoExperiment} />
      <ContactModal isOpen={isContactModalOpen} onClose={handleContactClose} />
      <Toaster />
    </div>
  );
}

export default Index;
