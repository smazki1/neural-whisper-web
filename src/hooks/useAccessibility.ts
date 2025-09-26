import { useEffect, useState, useCallback } from 'react';

interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reduceMotion: false,
    highContrast: false,
    fontSize: 'medium',
    colorBlindMode: 'none'
  });

  // Check for system preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQueryReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    const updateMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      setPreferences(prev => ({
        ...prev,
        reduceMotion: e.matches
      }));
    };

    const updateContrastPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      setPreferences(prev => ({
        ...prev,
        highContrast: e.matches
      }));
    };

    // Initial check
    updateMotionPreference(mediaQueryReduceMotion);
    updateContrastPreference(mediaQueryHighContrast);

    // Listen for changes
    mediaQueryReduceMotion.addEventListener('change', updateMotionPreference);
    mediaQueryHighContrast.addEventListener('change', updateContrastPreference);

    return () => {
      mediaQueryReduceMotion.removeEventListener('change', updateMotionPreference);
      mediaQueryHighContrast.removeEventListener('change', updateContrastPreference);
    };
  }, []);

  // Apply accessibility preferences to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply reduced motion
    if (preferences.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Apply high contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${preferences.fontSize}`);

    // Apply color blind mode
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (preferences.colorBlindMode !== 'none') {
      root.classList.add(preferences.colorBlindMode);
    }
  }, [preferences]);

  // Keyboard navigation helpers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const focusElement = useCallback((element: HTMLElement | null, options?: FocusOptions) => {
    if (element) {
      element.focus(options);
      announceToScreenReader(`מיקוד על ${element.getAttribute('aria-label') || element.textContent || 'אלמנט'}`);
    }
  }, [announceToScreenReader]);

  const skipToContent = useCallback(() => {
    const mainContent = document.getElementById('main-content') || 
                       document.querySelector('main') ||
                       document.querySelector('[role="main"]');
    
    if (mainContent) {
      focusElement(mainContent as HTMLElement);
    }
  }, [focusElement]);

  const skipToNavigation = useCallback(() => {
    const navigation = document.getElementById('main-navigation') ||
                      document.querySelector('nav') ||
                      document.querySelector('[role="navigation"]');
    
    if (navigation) {
      focusElement(navigation as HTMLElement);
    }
  }, [focusElement]);

  // Keyboard shortcut handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to content (Alt + 1)
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        skipToContent();
      }
      
      // Skip to navigation (Alt + 2)
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        skipToNavigation();
      }
      
      // Increase font size (Ctrl + +)
      if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        setPreferences(prev => ({
          ...prev,
          fontSize: prev.fontSize === 'small' ? 'medium' : 
                   prev.fontSize === 'medium' ? 'large' : 'large'
        }));
      }
      
      // Decrease font size (Ctrl + -)
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        setPreferences(prev => ({
          ...prev,
          fontSize: prev.fontSize === 'large' ? 'medium' : 
                   prev.fontSize === 'medium' ? 'small' : 'small'
        }));
      }
      
      // Toggle high contrast (Ctrl + Alt + H)
      if (e.ctrlKey && e.altKey && e.key === 'h') {
        e.preventDefault();
        setPreferences(prev => ({
          ...prev,
          highContrast: !prev.highContrast
        }));
        announceToScreenReader(
          preferences.highContrast ? 'ניגודיות גבוהה כובתה' : 'ניגודיות גבוהה הופעלה',
          'assertive'
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [skipToContent, skipToNavigation, announceToScreenReader, preferences.highContrast]);

  return {
    preferences,
    setPreferences,
    announceToScreenReader,
    focusElement,
    skipToContent,
    skipToNavigation
  };
};