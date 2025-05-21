import { endpoints } from './api';

// Auth service functions
const authService = {
  // Login user
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await endpoints.login({ email, password });
      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    let userStr = localStorage.getItem('user');
    if (!userStr) userStr = sessionStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }
};

export default authService;
