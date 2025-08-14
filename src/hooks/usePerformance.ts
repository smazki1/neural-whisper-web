import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

export const usePerformance = () => {
  useEffect(() => {
    const sendToAnalytics = (metric: Metric) => {
      // Send to your analytics service
      console.log('Performance metric:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
      
      // You can send this to Google Analytics, Supabase, or any other service
      // Example for future implementation:
      // gtag('event', metric.name, {
      //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //   event_category: 'Web Vitals',
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
    };

    // Measure all Web Vitals
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
};