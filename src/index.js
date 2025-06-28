import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Google Fonts import
import './assets/css/fonts.css'; // This will be created

// Import required styles first in the correct order
// Bootstrap CSS (main import - keep only this one)
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Custom styles that might override Bootstrap
import './assets/css/global.css'; // Add global styles
import './assets/css/scroll.css'; // Add scroll styles
import './assets/css/style.css';
import './assets/lib/animate/animate.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


// Enable React Router v7 features
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);

// Unregister any existing service workers and then register the new one
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
    // After unregistering, register the new service worker
    serviceWorkerRegistration.register({
      onSuccess: () => console.log('Service Worker registered successfully'),
      onUpdate: () => console.log('Service Worker updated'),
      onError: (error) => console.error('Service Worker registration failed:', error)
    });
  });
}
