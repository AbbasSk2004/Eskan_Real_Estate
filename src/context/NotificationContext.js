import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import notificationService from '../services/notificationService';
import { debounce } from 'lodash';
import websocketService from '../services/websocket';

const NotificationContext = createContext();

// Notification types
const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  MESSAGE: 'message',
  PROPERTY_UPDATE: 'property_update',
  INQUIRY: 'inquiry',
  FAVORITE: 'favorite'
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  stats: {
    total: 0,
    unread: 0,
    recent: 0,
    byType: {},
    byPriority: {
      high: 0,
      medium: 0,
      low: 0
    }
  },
  settings: {
    enableBrowserNotifications: true,
    enableEmailNotifications: true,
    enableSoundNotifications: true,
    enablePushNotifications: false,
    notificationTypes: {
      [NOTIFICATION_TYPES.MESSAGE]: true,
      [NOTIFICATION_TYPES.PROPERTY_UPDATE]: true,
      [NOTIFICATION_TYPES.INQUIRY]: true,
      [NOTIFICATION_TYPES.FAVORITE]: true
    }
  }
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const notifications = action.payload;
      const unreadCount = notifications.filter(n => !n.read).length;
      
      // Calculate stats
      const now = new Date();
      const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
      
      const stats = {
        total: notifications.length,
        unread: unreadCount,
        recent: notifications.filter(n => new Date(n.created_at) > twentyFourHoursAgo).length,
        byType: notifications.reduce((acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1;
          return acc;
        }, {}),
        byPriority: notifications.reduce((acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1;
          return acc;
        }, { high: 0, medium: 0, low: 0 })
      };

      return { 
        ...state, 
        notifications,
        unreadCount,
        stats,
        loading: false 
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = action.payload;
      const updatedNotifications = [newNotification, ...state.notifications];
      const newUnreadCount = updatedNotifications.filter(n => !n.read).length;
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: newUnreadCount
      };

    case NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id ? action.payload : notification
        )
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      const filteredUnreadCount = filteredNotifications.filter(n => !n.read).length;
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredUnreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const markedNotifications = state.notifications.map(notification =>
        notification.id === action.payload ? { ...notification, read: true } : notification
      );
      const markedUnreadCount = markedNotifications.filter(n => !n.read).length;
      return {
        ...state,
        notifications: markedNotifications,
        unreadCount: markedUnreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };

    case NOTIFICATION_ACTIONS.SET_SETTINGS:
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload }
      };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const [storedSettings, setStoredSettings] = useLocalStorage('notificationSettings', initialState.settings);
  const [shouldFetch, setShouldFetch] = useState(false);
  const toast = useToast();
  const abortControllerRef = useRef(null);
  const hasAttemptedFetch = useRef(false);
  const isMountedRef = useRef(true);

  // Initialize settings from localStorage
  useEffect(() => {
    if (storedSettings) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_SETTINGS, payload: storedSettings });
    }
  }, [storedSettings]);

  // Cleanup function for aborting pending requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Reset fetch state when auth changes
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      hasAttemptedFetch.current = false;
      setShouldFetch(false);
    }
  }, [isAuthenticated, user?.id]);

  // Fetch notifications with debouncing and request cancellation
  const fetchNotifications = useCallback(
    debounce(async () => {
      if (!isAuthenticated || !user?.id || !shouldFetch || hasAttemptedFetch.current || !isMountedRef.current) return;

      try {
        // Cancel any pending requests
        cleanup();

        // Create new abort controller
        abortControllerRef.current = new AbortController();
        dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
        hasAttemptedFetch.current = true;

        const { data, error } = await notificationService.getAll(abortControllerRef.current.signal);

        if (error) throw error;

        if (isMountedRef.current) {
          dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: data || [] });
        }
      } catch (error) {
        // Only dispatch error if it's not an abort error and component is mounted
        if (error.name !== 'AbortError' && isMountedRef.current) {
          dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
        }
      } finally {
        if (isMountedRef.current) {
          dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
        }
      }
    }, 1000), // 1 second debounce
    [isAuthenticated, user?.id, cleanup, shouldFetch]
  );

  // Fetch unread count with debouncing
  const fetchUnreadCount = useCallback(
    debounce(async () => {
      if (!isAuthenticated || !user?.id || !shouldFetch || !isMountedRef.current) return;

      try {
        const { data, error } = await notificationService.getUnreadCount();
        if (error) throw error;
        
        if (isMountedRef.current) {
          dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: data?.count || 0 });
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    }, 1000), // 1 second debounce
    [isAuthenticated, user?.id, shouldFetch]
  );

  // Fetch notification settings with debouncing
  const fetchSettings = useCallback(
    debounce(async () => {
      if (!isAuthenticated || !user?.id || !shouldFetch || !isMountedRef.current) return;

      try {
        const { data, error } = await notificationService.getSettings();
        if (error) throw error;

        if (data?.success && data?.data?.settings && isMountedRef.current) {
          dispatch({ type: NOTIFICATION_ACTIONS.SET_SETTINGS, payload: data.data.settings });
          setStoredSettings(data.data.settings);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      }
    }, 1000), // 1 second debounce
    [isAuthenticated, user?.id, setStoredSettings, shouldFetch]
  );

  // Effect for fetching notifications
  useEffect(() => {
    if (isAuthenticated && user?.id && shouldFetch) {
      fetchNotifications();
      fetchUnreadCount();
      fetchSettings();
    }

    return () => {
      cleanup();
      fetchNotifications.cancel();
      fetchUnreadCount.cancel();
      fetchSettings.cancel();
    };
  }, [isAuthenticated, user?.id, fetchNotifications, fetchUnreadCount, fetchSettings, cleanup, shouldFetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const { error } = await notificationService.markAsRead(notificationId);
      if (error) throw error;

      dispatch({
        type: NOTIFICATION_ACTIONS.MARK_AS_READ,
        payload: notificationId
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  }, [toast]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await notificationService.markAllAsRead();
      if (error) throw error;

      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  }, [toast]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const { error } = await notificationService.delete(notificationId);
      if (error) throw error;

      dispatch({
        type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
        payload: notificationId
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  }, [toast]);

  // Update notification settings
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const { data, error } = await notificationService.updateSettings(newSettings);
      
      if (error) {
        throw error;
      }

      // Extract the preferences from the response or the input
      const preferences = data?.notification_preferences || newSettings.notification_preferences;
      
      // Convert the API response format to our local settings format
      const localSettings = {
        push_notifications: preferences.push_enabled,
        email_notifications: preferences.email_enabled,
        sms_notifications: preferences.sms_enabled,
        chat_messages: preferences.notification_types.chat_messages,
        property_updates: preferences.notification_types.property_updates,
        system_updates: preferences.notification_types.system_updates,
        marketing_emails: preferences.notification_types.marketing,
        weekly_digest: preferences.digest_settings.weekly_digest,
        instant_notifications: preferences.digest_settings.instant_notifications,
        quiet_hours_enabled: preferences.quiet_hours.enabled,
        quiet_hours_start: preferences.quiet_hours.start_time,
        quiet_hours_end: preferences.quiet_hours.end_time
      };

      dispatch({ type: NOTIFICATION_ACTIONS.SET_SETTINGS, payload: localSettings });
      setStoredSettings(localSettings);
      toast.success('Notification settings updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error(error.message || 'Failed to update notification settings');
      throw error;
    }
  }, [setStoredSettings, toast]);

  // ---------------------------------------------
  // WebSocket integration: subscribe to realtime events
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    websocketService.connect();

    // Define handlers
    const handleCreated = ({ notification }) => {
      if (!notification) return;
      dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
    };

    const handleUpdated = ({ notification }) => {
      if (!notification) return;
      dispatch({ type: NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION, payload: notification });
    };

    const handleDeleted = ({ id }) => {
      if (!id) return;
      dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: id });
    };

    const handleConnection = ({ connected }) => {
      if (connected) {
        // On reconnect, force re-fetch to sync any missed items
        hasAttemptedFetch.current = false;
        setShouldFetch(true);
      }
    };

    // Subscribe to WebSocket events
    const unsubCreate = websocketService.subscribe('notification_created', handleCreated);
    const unsubUpdate = websocketService.subscribe('notification_updated', handleUpdated);
    const unsubDelete = websocketService.subscribe('notification_deleted', handleDeleted);
    const unsubConn = websocketService.subscribe('connection', handleConnection);

    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      unsubConn();
    };
  }, [isAuthenticated, user?.id, dispatch, setShouldFetch]);

  const value = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    fetchSettings,
    fetchNotifications: () => {
      hasAttemptedFetch.current = false;
      setShouldFetch(true);
    },
    startFetching: () => {
      hasAttemptedFetch.current = false;
      setShouldFetch(true);
    },
    stopFetching: () => setShouldFetch(false)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Export everything together
export default NotificationContext;