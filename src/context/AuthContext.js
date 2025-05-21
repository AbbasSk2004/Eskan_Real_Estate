import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  // Listen for login/logout changes in storage (for multi-tab support)
  useEffect(() => {
    const syncAuth = () => setCurrentUser(authService.getCurrentUser());
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    const user = await authService.login(email, password, rememberMe);
    setCurrentUser(user);
    return user;
  };

  // Register handler (if you want to auto-login after register)
  const register = async (...args) => {
    const user = await authService.register(...args);
    setCurrentUser(user);
    return user;
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const isAuthenticated = () => !!currentUser;

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      register,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
