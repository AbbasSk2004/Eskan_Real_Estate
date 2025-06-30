import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import authService from '../services/auth';
import { toast } from 'react-toastify';
import authStorage from '../utils/authStorage';
import { API_BASE_URL } from '../config/constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(() => {
    // Initialize user state from storage if we have a valid token
    if (authStorage.hasValidToken()) {
      return authStorage.getUserData();
    }
    return null;
  });
  const initializationRef = useRef(false);

  // Function to handle user state update
  const updateUserState = useCallback((userData) => {
    if (userData) {
      setUser(userData);
      authStorage.setUserData(userData);
    } else {
      setUser(null);
      authStorage.clearAll();
    }
  }, []);

  // Regular login function
  const login = async (email, password, remember = true) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password, remember);
      if (response.success) {
        updateUserState(response.user);
        // Initialize token refresh
        await authService.initializeTokenRefresh();
        
        // Explicitly update status to active after successful login
        try {
          await authService.updateStatus('active');
        } catch (statusError) {
          console.error('Failed to update status to active:', statusError);
          // Non-blocking - continue with login process
        }
        
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const socialLogin = async (provider = 'google') => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await authService.signInWithGoogle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Social login error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current auth token before logout
      const token = authStorage.getToken('access_token');
      
      // Call the logout endpoint first
      await authService.logout();
      
      // authService.logout() already attempted to mark the user inactive.
      // We skip an additional request here to avoid duplicate /auth/update-status
      // calls that can trigger warnings once the token is invalidated.
      
      // Clear all auth data
      authStorage.clearAll();
      
      // Clear any cached data
      if (window.localStorage) {
        // Clear profile data
        window.localStorage.removeItem('profile_data');
        // Clear any other cached data
        window.localStorage.removeItem('user_properties');
        window.localStorage.removeItem('user_favorites');
      }
      
      // Update user state
      updateUserState(null);
      
      // Clear any error state
      setError(null);
      
      // Dispatch an event to notify other components
      window.dispatchEvent(new CustomEvent('auth-state-change', {
        detail: { isAuthenticated: false }
      }));
      
      // Navigate to login page
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if the logout request fails, clear local data
      authStorage.clearAll();
      updateUserState(null);
      setError(err.message);
      toast.error('Failed to logout');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate, updateUserState]);

  // Initialize auth state
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initAuth = async () => {
      try {
        // Check if we have tokens in storage
        const accessToken = authStorage.getToken('access_token');
        const refreshToken = authStorage.getToken('refresh_token');
        
        // If no tokens, clear any stale data and return
        if (!accessToken && !refreshToken) {
          console.log('Auth initialization - No tokens found');
          authStorage.clearAll();
          updateUserState(null);
          setInitialized(true);
          return;
        }

        // Don't show loading if we already have a valid user
        const hasValidToken = authStorage.hasValidToken();
        const storedUser = authStorage.getUserData();
        const shouldShowLoading = !hasValidToken || !storedUser;
        
        if (shouldShowLoading) {
          setLoading(true);
        }
        setError(null);

        if (storedUser && hasValidToken) {
          // Initialize token refresh if we have a valid token
          const isAuthenticated = await authService.initializeTokenRefresh();
          if (isAuthenticated) {
            updateUserState(storedUser);
          } else {
            // Token refresh failed, clear session
            authStorage.clearAll();
            updateUserState(null);
          }
        } else if (refreshToken) {
          // Try to refresh the token
          try {
            const refreshResponse = await authService.refreshToken();
            if (refreshResponse?.success) {
              updateUserState(refreshResponse.user);
            } else {
              authStorage.clearAll();
              updateUserState(null);
            }
          } catch (refreshError) {
            console.error('Auth initialization - Token refresh error:', refreshError);
            authStorage.clearAll();
            updateUserState(null);
          }
        } else {
          // No valid session, clear any stale data
          authStorage.clearAll();
          updateUserState(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        authStorage.clearAll();
        updateUserState(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, [updateUserState]);

  // Whenever authentication state becomes active, mark profile status as active
  useEffect(() => {
    if (user && authStorage.getAccessToken()) {
      // Update active status silently (no need to await)
      import('../services/auth').then(({ default: authService }) => {
        authService.updateStatus?.('active');
      }).catch(() => {
        // ignore import errors
      });
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    login,
    logout,
    socialLogin,
    updateUserState
  };

  // Only show loading spinner if we're not initialized and don't have a valid user
  if (!initialized && loading && !user) {
    return <LoadingSpinner fullScreen text="Initializing authentication..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
