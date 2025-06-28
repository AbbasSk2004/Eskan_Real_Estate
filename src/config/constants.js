// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://eskan-real-estate-backend.onrender.com/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY: '/auth/verify'
};

// Property types
export const PROPERTY_TYPES = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  OFFICE: 'Office',
  SHOP: 'Shop',
  LAND: 'Land',
  WAREHOUSE: 'Warehouse',
  BUILDING: 'Building',
  FARM: 'Farm',
  CHALET: 'Chalet'
};

// Property status
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RENTED: 'rented',
  PENDING: 'pending'
};

// OAuth configuration
export const OAUTH_CONFIG = {
  PROVIDERS: {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
  },
  STORAGE_KEYS: {
    STATE: 'oauth_state',
    PROVIDER: 'oauth_provider',
    REDIRECT: 'oauth_redirect'
  },
  CALLBACK_PATHS: {
    GOOGLE: '/auth/callback/google'
  },
  POPUP_CONFIG: {
    width: 600,
    height: 800,
    left: window.screen.width / 2 - 300,
    top: window.screen.height / 2 - 400
  }
};

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  SESSION: 'session',
  AUTH_STATE: 'auth_state',
  AUTH_REDIRECT: 'auth_redirect'
};

// Auth events
export const AUTH_EVENTS = {
  STATE_CHANGE: 'auth-state-change',
  TOKEN_REFRESH: 'auth-token-refresh',
  LOGIN_SUCCESS: 'auth-login-success',
  LOGIN_FAILURE: 'auth-login-failure',
  LOGOUT: 'auth-logout'
};

export const PROVIDERS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook', // For future use
  TWITTER: 'twitter',   // For future use
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50
};

// Environment variables validation
const requiredEnvVars = {
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.warn(`Warning: Environment variable ${key} is not set. Using default value.`);
  }
});
