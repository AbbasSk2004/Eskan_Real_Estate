import axios from 'axios';
import authService from './auth';
import { useNavigate } from 'react-router-dom';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      authService.logout();
      // Optionally, use a custom event or context to trigger UI update
      window.dispatchEvent(new Event('sessionExpired'));
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyPhone: (data) => api.post('/auth/verify-phone', data),
  sendPhoneCode: (data) => api.post('/auth/send-phone-code', data),

  // Properties
  getProperties: (params) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  addProperty: (data) => api.post('/properties', data, {
    headers: { 'Content-Type': undefined }
  }),

  // Contact
  sendContactMessage: (data) => api.post('/contact', data),

  // Agents
  getAgents: (params) => api.get('/agents', { params }),

  // Testimonials
  addTestimonial: (data) => api.post('/testimonials', data),
  getTestimonials: () => api.get('/testimonials'),

  // Messaging
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (data) => api.post('/messages', data),
  markMessagesRead: (userId) => api.post(`/messages/${userId}/read`),
  getUnreadCounts: () => api.get('/messages/unread-counts'),

  // Profiles
  getProfiles: () => api.get('/profiles'),

  // New endpoint
  uploadChatFile: (formData) => api.post('/messages/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
