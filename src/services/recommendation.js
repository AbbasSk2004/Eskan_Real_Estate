import api from './api';

// Constants for local storage
const USER_PREFERENCES_KEY = 'user_property_preferences';
const VIEWED_PROPERTIES_KEY = 'user_viewed_properties';
const MAX_STORED_VIEWS = 20;

// Store user filter preferences in local storage
export const storeUserPreferences = (filters) => {
  try {
    // Only store non-empty filters
    const cleanFilters = Object.entries(filters)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
      
    if (Object.keys(cleanFilters).length > 0) {
      const existingPrefs = JSON.parse(localStorage.getItem(USER_PREFERENCES_KEY) || '[]');
      
      // Add timestamp to preferences
      const prefWithTimestamp = {
        ...cleanFilters,
        timestamp: Date.now()
      };
      
      // Keep only the last 10 preference sets
      const updatedPrefs = [prefWithTimestamp, ...existingPrefs].slice(0, 10);
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPrefs));
    }
  } catch (error) {
    console.error('Error storing user preferences:', error);
  }
};

// Store viewed property in local storage and send to server
export const storeViewedProperty = async (property) => {
  try {
    if (!property || !property.id) return;
    
    // Store locally
    const viewedProperties = JSON.parse(localStorage.getItem(VIEWED_PROPERTIES_KEY) || '[]');
    
    // Check if property is already in the list
    const existingIndex = viewedProperties.findIndex(p => p.id === property.id);
    
    // If exists, remove it to add it to the front (most recent)
    if (existingIndex !== -1) {
      viewedProperties.splice(existingIndex, 1);
    }
    
    // Add property to front with timestamp
    const propertyWithTimestamp = {
      id: property.id,
      property_type: property.property_type,
      price: property.price,
      governate: property.governate,
      city: property.city,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      timestamp: Date.now()
    };
    
    // Keep only the most recent views
    const updatedViews = [propertyWithTimestamp, ...viewedProperties].slice(0, MAX_STORED_VIEWS);
    localStorage.setItem(VIEWED_PROPERTIES_KEY, JSON.stringify(updatedViews));

    // Send to server
    try {
      await api.post(`/property-views/${property.id}`);
    } catch (error) {
      // Fail silently - local storage will serve as backup
      console.warn('Failed to store view on server:', error);
    }
  } catch (error) {
    console.error('Error storing viewed property:', error);
  }
};

// Get user's stored preferences and viewed properties
const getUserLocalData = () => {
  try {
    const preferences = JSON.parse(localStorage.getItem(USER_PREFERENCES_KEY) || '[]');
    const viewedProperties = JSON.parse(localStorage.getItem(VIEWED_PROPERTIES_KEY) || '[]');
    return { preferences, viewedProperties };
  } catch (error) {
    console.error('Error getting user local data:', error);
    return { preferences: [], viewedProperties: [] };
  }
};

// Get recommended properties from ML system for authenticated users
const getMlRecommendations = async (userId, limit = 5) => {
  try {
    const response = await api.get('/properties/recommended', {
      params: { user_id: userId, limit },
      validateStatus: (status) => status === 200 || status === 401
    });

    if (response.status === 401 || !response?.data?.data) {
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: response.data.data,
      source: response.data.source || 'ml'
    };
  } catch (error) {
    console.error('Error getting ML recommendations:', error);
    return { success: false, data: [] };
  }
};

// Get recommended properties for non-authenticated users
const getDefaultRecommendations = async (limit = 5) => {
  try {
    const response = await api.get('/properties/recommended', {
      params: { limit },
      validateStatus: (status) => status === 200 || status === 401
    });

    if (response.status === 401 || !response?.data?.data) {
      return [];
    }

    return response.data.data;
  } catch (error) {
    console.error('Error getting recommended properties:', error);
    return [];
  }
};

// Get recommended properties based on user's local preferences and viewing history
const getLocalRecommendations = async (limit = 5) => {
  try {
    const { preferences, viewedProperties } = getUserLocalData();
    
    // If no local data, return default recommendations
    if (preferences.length === 0 && viewedProperties.length === 0) {
      return getDefaultRecommendations(limit);
    }

    // Try to get recommendations from ML system using local view history
    try {
      const response = await api.post('/recommendations/local', {
        viewed_properties: viewedProperties,
        preferences,
        limit
      });

      if (response?.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('Failed to get ML recommendations for local data:', error);
    }
    
    // Fallback to default recommendations
    return getDefaultRecommendations(limit);
  } catch (error) {
    console.error('Error in getLocalRecommendations:', error);
    return getDefaultRecommendations(limit);
  }
};

// Main recommendation function that handles both authenticated and non-authenticated users
export const getRecommendedProperties = async (userId = null, limit = 5) => {
  try {
    if (userId) {
      // Try ML recommendations first
      const mlRecommendations = await getMlRecommendations(userId, limit);
      if (mlRecommendations.success && mlRecommendations.data.length > 0) {
        // Attach source metadata to the array for backward compatibility
        const arr = mlRecommendations.data;
        arr.source = mlRecommendations.source || 'ml';
        return arr;
      }

      // Fallback to local recommendations if ML fails
      const localRec = await getLocalRecommendations(limit);
      // Ensure we always return an array; attach source if missing
      if (Array.isArray(localRec)) {
        localRec.source = localRec.source || 'local';
      }
      return localRec;
    } else {
      const localRec2 = await getLocalRecommendations(limit);
      if (Array.isArray(localRec2)) {
        localRec2.source = localRec2.source || 'local';
      }
      return localRec2;
    }
  } catch (error) {
    console.error('Error in getRecommendedProperties:', error);
    const defRec = await getDefaultRecommendations(limit);
    if (Array.isArray(defRec)) {
      defRec.source = 'default';
    }
    return defRec;
  }
};