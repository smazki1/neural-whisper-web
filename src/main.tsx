import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const PWA_CLEANUP_VERSION = '2026-08-15';

if ('serviceWorker' in navigator && localStorage.getItem('pwa-cleanup-version') !== PWA_CLEANUP_VERSION) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(() => {
      localStorage.setItem('pwa-cleanup-version', PWA_CLEANUP_VERSION);
    }).catch((error) => {
      console.error('Service worker cleanup registration failed:', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
