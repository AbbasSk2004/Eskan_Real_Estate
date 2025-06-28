// Common error codes and messages
const AUTH_ERROR_CODES = {
  INVALID_TOKEN: 'invalid_token',
  TOKEN_EXPIRED: 'token_expired',
  REFRESH_FAILED: 'refresh_failed',
  STATE_MISMATCH: 'state_mismatch',
  SESSION_INVALID: 'session_invalid',
  UNAUTHORIZED: 'unauthorized',
  PROFILE_ERROR: 'profile_error',
  NETWORK_ERROR: 'network_error',
  OAUTH_ERROR: 'oauth_error'
};

const ERROR_MESSAGES = {
  [AUTH_ERROR_CODES.INVALID_TOKEN]: 'Invalid authentication token',
  [AUTH_ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
  [AUTH_ERROR_CODES.REFRESH_FAILED]: 'Failed to refresh authentication token',
  [AUTH_ERROR_CODES.STATE_MISMATCH]: 'Security validation failed. Please try again',
  [AUTH_ERROR_CODES.SESSION_INVALID]: 'Invalid or expired session',
  [AUTH_ERROR_CODES.UNAUTHORIZED]: 'You must be logged in to access this resource',
  [AUTH_ERROR_CODES.PROFILE_ERROR]: 'Failed to fetch user profile',
  [AUTH_ERROR_CODES.NETWORK_ERROR]: 'Network error occurred during authentication',
  [AUTH_ERROR_CODES.OAUTH_ERROR]: 'Authentication failed with the provider'
};

// Handle OAuth-specific errors
export const handleOAuthError = (error, provider = 'provider') => {
  console.error(`OAuth ${provider} error:`, error);

  // Extract error details
  const errorCode = error.code || error.error || AUTH_ERROR_CODES.OAUTH_ERROR;
  const errorMessage = error.message || error.error_description || ERROR_MESSAGES[AUTH_ERROR_CODES.OAUTH_ERROR];

  // Log detailed error for debugging
  console.error('OAuth error details:', {
    code: errorCode,
    message: errorMessage,
    provider,
    originalError: error
  });

  return {
    code: errorCode,
    message: errorMessage,
    provider,
    shouldRetry: !errorMessage.toLowerCase().includes('denied') && 
                 !errorMessage.toLowerCase().includes('cancelled')
  };
};

// Handle token-related errors
export const handleTokenError = (error) => {
  console.error('Token error:', error);

  // Check if it's a token expiration
  if (error?.response?.status === 401 || 
      (error?.message && error.message.toLowerCase().includes('token'))) {
    return {
      code: AUTH_ERROR_CODES.TOKEN_EXPIRED,
      message: ERROR_MESSAGES[AUTH_ERROR_CODES.TOKEN_EXPIRED],
      shouldRefresh: true
    };
  }

  return {
    code: AUTH_ERROR_CODES.INVALID_TOKEN,
    message: ERROR_MESSAGES[AUTH_ERROR_CODES.INVALID_TOKEN],
    shouldRefresh: false
  };
};

// Handle session-related errors
export const handleSessionError = (error) => {
  console.error('Session error:', error);

  return {
    code: AUTH_ERROR_CODES.SESSION_INVALID,
    message: ERROR_MESSAGES[AUTH_ERROR_CODES.SESSION_INVALID],
    shouldLogout: true
  };
};

// Validate OAuth state
export const validateOAuthState = (receivedState, storedState) => {
  if (!receivedState || !storedState || receivedState !== storedState) {
    console.error('State validation failed:', {
      received: receivedState,
      stored: storedState
    });
    
    return {
      isValid: false,
      error: {
        code: AUTH_ERROR_CODES.STATE_MISMATCH,
        message: ERROR_MESSAGES[AUTH_ERROR_CODES.STATE_MISMATCH]
      }
    };
  }

  return { isValid: true };
};

// Handle profile-related errors
export const handleProfileError = (error) => {
  console.error('Profile error:', error);

  return {
    code: AUTH_ERROR_CODES.PROFILE_ERROR,
    message: ERROR_MESSAGES[AUTH_ERROR_CODES.PROFILE_ERROR],
    shouldRetry: error?.code !== 'PGRST116' // Don't retry if profile not found
  };
};

// Main error handler for auth operations
export const handleAuthError = (error) => {
  // Network errors
  if (!error.response) {
    return {
      code: AUTH_ERROR_CODES.NETWORK_ERROR,
      message: ERROR_MESSAGES[AUTH_ERROR_CODES.NETWORK_ERROR],
      shouldRetry: true
    };
  }

  // Handle specific error types
  switch (error.response.status) {
    case 401:
      return handleTokenError(error);
    case 403:
      return {
        code: AUTH_ERROR_CODES.UNAUTHORIZED,
        message: ERROR_MESSAGES[AUTH_ERROR_CODES.UNAUTHORIZED],
        shouldLogout: true
      };
    case 500:
      if (error.response.data?.error === 'profile_error') {
        return handleProfileError(error);
      }
      break;
    default:
      break;
  }

  // Default error response
  return {
    code: error.response.data?.error || 'unknown_error',
    message: error.response.data?.message || 'An unexpected error occurred',
    shouldRetry: false
  };
};

export const AUTH_ERROR_TYPES = AUTH_ERROR_CODES; 