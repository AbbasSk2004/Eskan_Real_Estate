import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = () => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth is initializing or loading
  if (!initialized || loading) {
    return <LoadingSpinner fullScreen text="loading..." />;
  }

  // Store the current path for redirect after login
  if (!user) {
    localStorage.setItem('auth_redirect', location.pathname);
  }

  // If not authenticated, redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default PrivateRoute; 