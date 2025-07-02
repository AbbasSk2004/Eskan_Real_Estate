import ReactGA from 'react-ga4';

let isInitialized = false;

export const initAnalytics = () => {
  if (isInitialized) return;
  const measurementId = process.env.REACT_APP_GA_ID || 'G-XXXXXXX';
  if (!measurementId || measurementId === 'G-XXXXXXX') {
    // eslint-disable-next-line no-console
    console.warn('Google Analytics measurement ID is missing or default. Tracking is disabled.');
    return;
  }
  ReactGA.initialize(measurementId);
  isInitialized = true;
};

export const sendPageview = (path) => {
  if (!isInitialized) return;
  ReactGA.send({ hitType: 'pageview', page: path });
}; 