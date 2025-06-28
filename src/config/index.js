const config = {
  API_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/api' // Development URL
    : 'https://eskan-real-estate-backend.onrender.com/api', // Production API URL
  WS_URL: (() => {
    const raw = process.env.REACT_APP_WS_URL || 'wss://eskan-real-estate-backend.onrender.com';
    // Remove inline comments (anything after #) and trim spaces
    return raw.split('#')[0].trim();
  })(),
};

export default config; 