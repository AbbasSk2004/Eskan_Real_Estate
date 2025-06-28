import { useState, useEffect, useRef } from 'react';
import { endpoints } from '../services/api';
import authStorage from '../utils/authStorage';
import { useAuth } from '../context/AuthContext';

export const useProfilePolling = (interval = 10000) => {
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(authStorage.getProfileData() || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isManualUpdateRef = useRef(false);

  useEffect(() => {
    // Don't poll if not authenticated
    if (!isAuthenticated) {
      setProfileData(null);
      setError(null);
      return;
    }

    const fetchProfile = async (isManual = false) => {
      try {
        // Only show loading for manual updates
        if (isManual) {
          setLoading(true);
        }
        setError(null);
        
        const response = await endpoints.profile.get();
        
        if (response?.data?.success && response?.data?.data) {
          const newProfileData = response.data.data;
          setProfileData(newProfileData);
          // Store the updated profile data
          authStorage.setProfileData(newProfileData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err);
        // Clear profile data on error
        setProfileData(null);
        authStorage.clearProfileData();
      } finally {
        if (isManual) {
          setLoading(false);
        }
      }
    };

    // Fetch immediately on mount
    fetchProfile(false);

    // Set up polling interval
    const pollInterval = setInterval(() => fetchProfile(false), interval);

    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, [interval, isAuthenticated]);

  // Function for manual profile refresh
  const refreshProfile = async () => {
    isManualUpdateRef.current = true;
    try {
      await fetchProfile(true);
    } finally {
      isManualUpdateRef.current = false;
    }
  };

  return { 
    profileData, 
    loading: loading && isManualUpdateRef.current, // Only show loading for manual updates
    error,
    refreshProfile 
  };
}; 