import { STORAGE_KEYS } from '../config/constants';

class AuthStorage {
  constructor() {
    this.prefix = 'auth_';
    if (typeof window !== 'undefined') {
      this.local = window.localStorage;
      this.session = window.sessionStorage;
    } else {
      this.local = null;
      this.session = null;
    }
  }

  // Get access token
  getAccessToken() {
    return this.getToken('access_token');
  }

  // Get refresh token
  getRefreshToken() {
    return this.getToken('refresh_token');
  }

  // Set both tokens with remember-me flag (default true => persistent)
  setTokens(accessToken, refreshToken, remember = true) {
    this.setToken('access_token', accessToken, remember);
    if (refreshToken) {
      this.setToken('refresh_token', refreshToken, remember);
    }
  }

  // Clear both tokens
  clearTokens() {
    this.removeToken('access_token');
    this.removeToken('refresh_token');
  }

  // Set a token. If remember=false, token is stored in sessionStorage only (cleared on browser close)
  // Default remember=true stores token in localStorage (persists across sessions)
  setToken(key, value, remember = true) {
    if (!value) return;
    const fullKey = this.prefix + key;
    if (remember) {
      this.local && this.local.setItem(fullKey, value);
      // Ensure session copy removed
      this.session && this.session.removeItem(fullKey);
    } else {
      this.session && this.session.setItem(fullKey, value);
      // Ensure local copy removed
      this.local && this.local.removeItem(fullKey);
    }
  }

  // Get a token (check sessionStorage first, then localStorage)
  getToken(key) {
    const fullKey = this.prefix + key;
    if (this.session && this.session.getItem(fullKey)) {
      return this.session.getItem(fullKey);
    }
    if (this.local) {
      return this.local.getItem(fullKey);
    }
    return null;
  }

  // Remove a token
  removeToken(key) {
    const fullKey = this.prefix + key;
    this.local && this.local.removeItem(fullKey);
    this.session && this.session.removeItem(fullKey);
  }

  // Check if token is valid
  hasValidToken() {
    try {
      const token = this.getAccessToken();
      if (!token) return false;

      // Parse the JWT payload
      const [, payloadBase64] = token.split('.');
      if (!payloadBase64) return false;

      const payload = JSON.parse(atob(payloadBase64));
      if (!payload.exp) return false;

      // Check if token is expired (with 5 second buffer)
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = payload.exp - now;
      return expiresIn > 5;
    } catch (err) {
      return false;
    }
  }

  // Set user data
  setUserData(data) {
    if (!this.local || !data) return;
    this.local.setItem(this.prefix + 'user', JSON.stringify(data));
  }

  // Get user data
  getUserData() {
    if (!this.local) return null;
    try {
      const data = this.local.getItem(this.prefix + 'user');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  // Set profile data separately from user data
  setProfileData(data) {
    if (!this.local || !data) return;
    this.local.setItem(this.prefix + 'profile', JSON.stringify(data));
  }

  // Get profile data
  getProfileData() {
    if (!this.local) return null;
    try {
      const data = this.local.getItem(this.prefix + 'profile');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  // Set auth provider
  setAuthProvider(provider) {
    if (!this.local) return;
    this.local.setItem(this.prefix + 'provider', provider);
  }

  // Get auth provider
  getAuthProvider() {
    if (!this.local) return null;
    const provider = this.local.getItem(this.prefix + 'provider') || 'backend';
    return provider;
  }

  // Clear profile data
  clearProfileData() {
    if (!this.local) return;
    this.local.removeItem(this.prefix + 'profile');
  }

  // Clear all auth data
  clearAll() {
    // Clear from localStorage
    if (this.local) {
      Object.keys(this.local).forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.local.removeItem(key);
        }
      });
    }

    // Clear from sessionStorage
    if (this.session) {
      Object.keys(this.session).forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.session.removeItem(key);
        }
      });
    }
  }

  // Initialize auth state
  initializeAuthState() {
    if (!this.local) return;
    // Clear any existing auth data
    this.clearAll();
  }
}

export default new AuthStorage();