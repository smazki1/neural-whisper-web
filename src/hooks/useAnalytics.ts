import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { normalizeGoogleAnalyticsId } from '@/lib/analyticsConfig.js';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[][];
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    price?: number;
    quantity?: number;
  }>;
}

interface AnalyticsOptions {
  trackPageViews?: boolean;
}

const GA_MEASUREMENT_ID = normalizeGoogleAnalyticsId(
  import.meta.env.VITE_GA_MEASUREMENT_ID,
);
let analyticsInitialized = false;

export const useAnalytics = ({ trackPageViews = false }: AnalyticsOptions = {}) => {
  const location = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || analyticsInitialized) return;

    analyticsInitialized = true;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: false, // We'll manually send page views
      // Enhanced measurements
      enhanced_conversions: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: true
    });

  }, []);

  // Track page views
  useEffect(() => {
    if (!trackPageViews || !GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href
    });
  }, [location, trackPageViews]);

  // Track custom events
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });
  }, []);

  // Track conversions
  const trackConversion = useCallback((conversion: ConversionEvent) => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', conversion.event_name, {
      currency: conversion.currency || 'ILS',
      value: conversion.value,
      items: conversion.items
    });
  }, []);

  // Track specific business events
  const trackContactFormSubmission = useCallback((formType: string = 'general') => {
    trackEvent({
      action: 'form_submit',
      category: 'engagement',
      label: `contact_form_${formType}`
    });

    trackConversion({
      event_name: 'generate_lead',
      value: 50 // Estimated lead value
    });
  }, [trackEvent, trackConversion]);

  const trackBlogEngagement = useCallback((articleTitle: string, action: 'view' | 'share' | 'complete_read') => {
    trackEvent({
      action: `blog_${action}`,
      category: 'content',
      label: articleTitle,
      custom_parameters: {
        content_type: 'blog_post',
        content_id: articleTitle.toLowerCase().replace(/\s+/g, '_')
      }
    });
  }, [trackEvent]);

  const trackCourseEngagement = useCallback((courseTitle: string, action: 'view' | 'enroll' | 'complete') => {
    trackEvent({
      action: `course_${action}`,
      category: 'education',
      label: courseTitle,
      custom_parameters: {
        content_type: 'course',
        content_id: courseTitle.toLowerCase().replace(/\s+/g, '_')
      }
    });

    if (action === 'enroll') {
      trackConversion({
        event_name: 'purchase',
        currency: 'ILS',
        value: 497, // Default course price
        items: [{
          item_id: courseTitle.toLowerCase().replace(/\s+/g, '_'),
          item_name: courseTitle,
          category: 'course',
          price: 497,
          quantity: 1
        }]
      });
    }
  }, [trackEvent, trackConversion]);

  const trackCTAClick = useCallback((ctaText: string, location: string) => {
    trackEvent({
      action: 'cta_click',
      category: 'engagement',
      label: `${ctaText}_${location}`,
      custom_parameters: {
        cta_text: ctaText,
        cta_location: location
      }
    });
  }, [trackEvent]);

  const trackVideoEngagement = useCallback((videoTitle: string, action: 'play' | 'pause' | 'complete', progress?: number) => {
    trackEvent({
      action: `video_${action}`,
      category: 'media',
      label: videoTitle,
      value: progress,
      custom_parameters: {
        video_title: videoTitle,
        video_progress: progress
      }
    });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, fileType: string) => {
    trackEvent({
      action: 'file_download',
      category: 'engagement',
      label: fileName,
      custom_parameters: {
        file_name: fileName,
        file_type: fileType
      }
    });
  }, [trackEvent]);

  const trackScroll = useCallback((percentage: number) => {
    // Only track major scroll milestones
    if ([25, 50, 75, 90].includes(percentage)) {
      trackEvent({
        action: 'scroll',
        category: 'engagement',
        label: `${percentage}%`,
        value: percentage
      });
    }
  }, [trackEvent]);

  return {
    trackEvent,
    trackConversion,
    trackContactFormSubmission,
    trackBlogEngagement,
    trackCourseEngagement,
    trackCTAClick,
    trackVideoEngagement,
    trackDownload,
    trackScroll
  };
};
