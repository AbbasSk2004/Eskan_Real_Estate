import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  showBrowserNotification, 
  playNotificationSound
} from '../utils/notificationUtils';
import notificationService from '../services/notificationService';
import { useToast } from './useToast';
import websocketService from '../services/websocket';

// Create a singleton for polling to prevent multiple instances
let activePollingRequests = new Map();
let pollingTimeouts = new Map();
let lastNotificationTimestamp = new Map();

export const useNotifications = (options = {}) => {
  const {
    enableBrowserNotifications = true,
    enableSound = true,
    pollInterval = 10000, // 10 seconds for more real-time updates
    autoMarkRead = false
  } = options;

  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const mountedRef = useRef(true);
  const lastFetchRef = useRef(Date.now());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isManualFetchRef = useRef(false);

  const updateNotificationState = useCallback((updatedNotifications) => {
    if (mountedRef.current) {
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    }
  }, []);

  const fetchNotifications = useCallback(async (force = false) => {
    // If there's already a request in progress for this user, don't start another one
    if (activePollingRequests.get(user?.id)) {
      return;
    }

    if (!isAuthenticated || !user?.id || !mountedRef.current) {
      return;
    }

    // Don't fetch if the last fetch was too recent (unless forced)
    const now = Date.now();
    if (!force && !isInitialLoad && now - lastFetchRef.current < 5000) { // Throttle to max once per 5 seconds
      return;
    }

    try {
      // Only show loading on initial load or manual fetch
      if (isInitialLoad || isManualFetchRef.current) {
        setLoading(true);
      }
      setError(null);
      
      // Set the flag that we're fetching for this user
      activePollingRequests.set(user.id, true);
      lastFetchRef.current = now;
      
      const lastTimestamp = lastNotificationTimestamp.get(user.id) || 0;
      const response = await notificationService.getAllNotifications();
      
      if (mountedRef.current) {
        if (response.error) {
          setError(response.error);
        } else {
          const newNotifications = response.data.notifications || [];
          
          // Check for new notifications only if the data is not from cache
          if (!response.data.fromCache) {
            const hasNewNotifications = newNotifications.some(notification => 
              new Date(notification.created_at).getTime() > lastTimestamp
            );

            if (hasNewNotifications) {
              // Update the timestamp of the latest notification
              const latestTimestamp = Math.max(
                ...newNotifications.map(n => new Date(n.created_at).getTime())
              );
              lastNotificationTimestamp.set(user.id, latestTimestamp);

              // Show browser notification if enabled and not the initial load
              if (!isInitialLoad && enableBrowserNotifications && document.hidden) {
                const newUnreadCount = newNotifications.filter(n => !n.read).length;
                if (newUnreadCount > unreadCount) {
                  showBrowserNotification('New Notification', 'You have new notifications');
                  if (enableSound) {
                    playNotificationSound();
                  }
                }
              }
            }
          }

          setNotifications(newNotifications);
          setUnreadCount(newNotifications.filter(n => !n.read).length || 0);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        // Only update loading state for initial load or manual fetch
        if (isInitialLoad || isManualFetchRef.current) {
          setLoading(false);
        }
        setIsInitialLoad(false);
        isManualFetchRef.current = false;
      }
      // Clear the flag that we're fetching for this user
      activePollingRequests.delete(user.id);
    }
  }, [isAuthenticated, user?.id, enableBrowserNotifications, enableSound, unreadCount, isInitialLoad]);

  // Manual fetch wrapper that sets isManualFetch flag
  const manualFetch = useCallback(async () => {
    isManualFetchRef.current = true;
    await fetchNotifications(true);
  }, [fetchNotifications]);

  const startPolling = useCallback(() => {
    if (!isAuthenticated || !user?.id) return;

    // Clear any existing polling for this user
    if (pollingTimeouts.has(user.id)) {
      clearTimeout(pollingTimeouts.get(user.id));
      pollingTimeouts.delete(user.id);
    }

    const poll = async () => {
      await fetchNotifications();
      if (mountedRef.current) {
        const timeoutId = setTimeout(poll, pollInterval);
        pollingTimeouts.set(user.id, timeoutId);
      }
    };

    // Start polling
    poll();
  }, [isAuthenticated, user?.id, pollInterval, fetchNotifications]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (isAuthenticated && user?.id) {
      fetchNotifications();
      startPolling();
    }

    return () => {
      mountedRef.current = false;
      if (user?.id) {
        // Cleanup polling for this user
        if (pollingTimeouts.has(user.id)) {
          clearTimeout(pollingTimeouts.get(user.id));
          pollingTimeouts.delete(user.id);
        }
        activePollingRequests.delete(user.id);
      }
    };
  }, [isAuthenticated, user?.id, startPolling, fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await notificationService.markAsRead(notificationId);
      if (error) throw error;

      if (mountedRef.current) {
        const updatedNotifications = notifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        );
        updateNotificationState(updatedNotifications);
        // Force fetch to ensure sync with server
        fetchNotifications(true);
      }
    } catch (err) {
      if (mountedRef.current) {
        toast.error('Failed to mark notification as read');
      }
    }
  }, [isAuthenticated, user, notifications, toast, fetchNotifications, updateNotificationState]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await notificationService.markAllAsRead();
      if (error) throw error;

      if (mountedRef.current) {
        const updatedNotifications = notifications.map(notification => ({ 
          ...notification, 
          read: true 
        }));
        updateNotificationState(updatedNotifications);
        toast.success('All notifications marked as read');
        // Force fetch to ensure sync with server
        fetchNotifications(true);
      }
    } catch (err) {
      if (mountedRef.current) {
        toast.error('Failed to mark all notifications as read');
      }
    }
  }, [isAuthenticated, user, notifications, toast, fetchNotifications, updateNotificationState]);

  const bulkMarkAsRead = useCallback(async (notificationIds) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await notificationService.bulkMarkAsRead(notificationIds);
      if (error) throw error;

      if (mountedRef.current) {
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          read: notification.read || notificationIds.includes(notification.id)
        }));
        updateNotificationState(updatedNotifications);
        // Force fetch to ensure sync with server
        fetchNotifications(true);
      }
    } catch (err) {
      if (mountedRef.current) {
        toast.error('Failed to mark notifications as read');
      }
    }
  }, [isAuthenticated, user, notifications, toast, fetchNotifications, updateNotificationState]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await notificationService.delete(notificationId);
      if (error) throw error;

      if (mountedRef.current) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );

        if (notifications.find(n => n.id === notificationId && !n.read)) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }

        toast.success('Notification deleted');
      }
    } catch (err) {
      if (mountedRef.current) {
        toast.error('Failed to delete notification');
      }
    }
  }, [isAuthenticated, user, notifications, toast]);

  // Add clearAllNotifications function after deleteNotification
  const clearAllNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await notificationService.clearAllNotifications();
      if (error) throw error;

      if (mountedRef.current) {
        setNotifications([]);
        setUnreadCount(0);
        toast.success('All notifications cleared');
      }
    } catch (err) {
      if (mountedRef.current) {
        toast.error('Failed to clear notifications');
        throw err; // Re-throw to handle in the component
      }
    }
  }, [isAuthenticated, user, toast]);

  // Auto mark as read when viewing
  useEffect(() => {
    if (autoMarkRead && notifications.length > 0 && isAuthenticated && user) {
      const unreadNotifications = notifications.filter(n => !n.read);
      unreadNotifications.forEach(notification => {
        markAsRead(notification.id);
      });
    }
  }, [autoMarkRead, notifications, markAsRead, isAuthenticated, user]);

  // WebSocket integration: listen for real-time notification events
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // Establish a single socket connection (no-op if already connected)
    websocketService.connect();

    // Handlers for server-emitted events
    const handleCreated = ({ notification }) => {
      if (!notification) return;
      setNotifications(prev => {
        if (prev.some(n => n.id === notification.id)) return prev; // avoid duplicates
        const updated = [notification, ...prev];
        if (!notification.read) {
          setUnreadCount(updated.filter(n => !n.read).length);
        }
        // Optional UX: browser push + sound when the tab is hidden
        if (enableBrowserNotifications && document.hidden) {
          showBrowserNotification(notification.title, notification.message);
          if (enableSound) {
            playNotificationSound();
          }
        }
        return updated;
      });
    };

    const handleUpdated = ({ notification }) => {
      if (!notification) return;
      setNotifications(prev => {
        const updated = prev.map(n => (n.id === notification.id ? notification : n));
        setUnreadCount(updated.filter(n => !n.read).length);
        return updated;
      });
    };

    const handleDeleted = ({ id }) => {
      if (!id) return;
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id);
        setUnreadCount(updated.filter(n => !n.read).length);
        return updated;
      });
    };

    const handleConnection = ({ connected }) => {
      if (connected) {
        // On reconnect pull any missed data
        fetchNotifications(true);
      }
    };

    // Subscribe to events and capture unsubscribe fns
    const unsubCreate = websocketService.subscribe('notification_created', handleCreated);
    const unsubUpdate = websocketService.subscribe('notification_updated', handleUpdated);
    const unsubDelete = websocketService.subscribe('notification_deleted', handleDeleted);
    const unsubConn = websocketService.subscribe('connection', handleConnection);

    // Cleanup subscriptions on unmount / auth change
    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      unsubConn();
    };
  }, [isAuthenticated, user?.id, enableBrowserNotifications, enableSound, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications: manualFetch, // Use manualFetch for explicit fetches
    markAsRead,
    markAllAsRead,
    bulkMarkAsRead,
    deleteNotification,
    clearAllNotifications,
    refetch: manualFetch
  };
};