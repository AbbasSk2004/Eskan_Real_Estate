import api from '../services/api';

// Check that the environment is properly set up
export const checkEnvironmentSetup = async () => {
  try {
    console.log('Checking environment setup...');
    
    // Check if we can connect to the backend API
    const healthCheck = await api.get('/health');
    
    if (healthCheck.status !== 200) {
      console.error('API health check failed:', healthCheck.status);
      return false;
    }
    
    console.log('Environment setup validated successfully');
    return true;
  } catch (error) {
    console.error('Environment setup check failed:', error);
    
    // Special case: if we're in production, don't fail on environment setup
    // This allows the app to work even if the backend is temporarily down
    if (process.env.NODE_ENV === 'production') {
      console.warn('Production mode: continuing despite environment setup failure');
      return true;
    }
    
    return false;
  }
};

export const getSetupInstructions = () => {
  return `
    To set up your environment:
    1. Create a .env file in your project root
    2. Add this variable to your .env file:
       REACT_APP_API_BASE_URL=http://localhost:3001/api
    3. Start the API server:
       - Navigate to the backend directory
       - Run npm install
       - Run npm start
    4. Save the .env file
    5. Restart your development server
    Need help? Check the documentation in the README.md
  `;
}; 