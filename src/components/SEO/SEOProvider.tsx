import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OrganizationSchema } from './OrganizationSchema';
import { BreadcrumbSchema } from './BreadcrumbSchema';
import { useAnalytics } from '@/hooks/useAnalytics';

interface SEOContextType {
  updatePageTitle: (title: string) => void;
  updateMetaDescription: (description: string) => void;
  updateCanonicalUrl: (url: string) => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within SEOProvider');
  }
  return context;
};

interface SEOProviderProps {
  children: React.ReactNode;
}

export const SEOProvider = ({ children }: SEOProviderProps) => {
  const location = useLocation();
  const analytics = useAnalytics({ trackPageViews: true });

  const updatePageTitle = (title: string) => {
    document.title = title.includes('AI Master') ? title : `${title} | AI Master`;
  };

  const updateMetaDescription = (description: string) => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  };

  const updateCanonicalUrl = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  };

  // Update canonical URL on route change
  useEffect(() => {
    const currentUrl = `${window.location.origin}${location.pathname}`;
    updateCanonicalUrl(currentUrl);
  }, [location]);

  // Add scroll tracking for analytics
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercentage = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        analytics.trackScroll(scrollPercentage);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [analytics]);

  const contextValue: SEOContextType = {
    updatePageTitle,
    updateMetaDescription,
    updateCanonicalUrl
  };

  return (
    <SEOContext.Provider value={contextValue}>
      <OrganizationSchema />
      <BreadcrumbSchema />
      {children}
    </SEOContext.Provider>
  );
};
