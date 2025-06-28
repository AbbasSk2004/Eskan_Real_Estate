import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chat.service';
import { toast } from 'react-toastify';
import websocketService from '../services/websocket';

export const useChat = () => {
  const { user, isAuthenticated, refreshToken } = useAuth();
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const pollingInterval = useRef(null);
  const fetchInProgress = useRef(false);
  const lastFetchTime = useRef(0);
  const MIN_FETCH_INTERVAL = 5000; // Minimum 5 seconds between fetches
  const activeConversationRef = useRef(activeConversation);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Clear any errors
  const clearError = () => setError(null);

  // Handle API errors
  const handleApiError = async (error) => {
    console.error('API Error:', error);
    if (error.message?.includes('token expired')) {
      try {
        await refreshToken();
        return true; // Indicate that we should retry the operation
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        setError('Session expired. Please sign in again.');
        return false;
      }
    }
    setError(error.message);
    return false;
  };

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (conversationId) => {
    if (!isAuthenticated || !user) return;
    
    try {
      await chatService.markMessagesAsRead(conversationId);
      // Update the messages in state to mark them as read
      setMessages(prev => prev.map(msg => ({
        ...msg,
        read: msg.sender_id !== user.id ? true : msg.read
      })));
    } catch (err) {
      const shouldRetry = await handleApiError(err);
      if (shouldRetry) {
        return markMessagesAsRead(conversationId);
      }
    }
  }, [user, isAuthenticated, refreshToken]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!isAuthenticated || !user || fetchInProgress.current || !conversationId) {
      return;
    }

    try {
      fetchInProgress.current = true;
      setLoadingMessages(true);
      clearError();
      
      console.log('Fetching messages for conversation:', conversationId);
      const data = await chatService.fetchMessages(conversationId);
      
      if (Array.isArray(data)) {
        setMessages(data);
        console.log(`Loaded ${data.length} messages for conversation:`, conversationId);
      } else {
        setMessages([]);
      }
      lastFetchTime.current = Date.now();
    } catch (err) {
      console.error('Error fetching messages:', err);
      const shouldRetry = await handleApiError(err);
      if (shouldRetry) {
        return fetchMessages(conversationId);
      }
    } finally {
      fetchInProgress.current = false;
      setLoadingMessages(false);
    }
  }, [user, isAuthenticated, refreshToken]);

  // Handle active conversation change
  const handleSetActiveConversation = useCallback((conversation) => {
    if (conversation?.id !== activeConversation?.id) {
      console.log('Setting active conversation:', conversation?.id);
      setActiveConversation(conversation);
      setMessages([]); // Clear messages before loading new ones
      if (conversation) {
        fetchMessages(conversation.id);
        // Mark messages as read when conversation becomes active
        markMessagesAsRead(conversation.id);
      }
    }
  }, [activeConversation, fetchMessages, markMessagesAsRead]);

  // Helper: get timestamp of a conversation's latest message
  const getLastMessageDate = (conv) => {
    if (Array.isArray(conv?.messages) && conv.messages.length > 0) {
      return new Date(conv.messages[conv.messages.length - 1].created_at);
    }
    if (conv.last_message?.created_at) {
      return new Date(conv.last_message.created_at);
    }
    // Fallback to updated_at / created_at if available
    return conv.updated_at ? new Date(conv.updated_at) : new Date(0);
  };

  // Helper: sort conversations by most-recent message (descending)
  const sortConversations = (list) =>
    [...list].sort((a, b) => getLastMessageDate(b) - getLastMessageDate(a));

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated || !user || fetchInProgress.current) {
      return;
    }

    try {
      fetchInProgress.current = true;
      setLoadingConversations(true);
      clearError();
      
      // Ensure we get fresh data every time by clearing the cached list first
      chatService.clearConversationCache();
      const data = await chatService.fetchConversations();
      if (Array.isArray(data)) {
        // Keep list ordered by latest activity
        setConversations(sortConversations(data));
        // Update active conversation if it is still the current view
        if (activeConversationRef.current) {
          const updatedConv = data.find(conv => conv.id === activeConversationRef.current.id);
          if (updatedConv) {
            setActiveConversation(updatedConv);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      const shouldRetry = await handleApiError(err);
      if (shouldRetry) {
        return fetchConversations();
      }
    } finally {
      fetchInProgress.current = false;
      setLoadingConversations(false);
    }
  }, [user, isAuthenticated, refreshToken]);

  // Start polling when component mounts (ensure only one interval)
  useEffect(() => {
    // Start polling only once when the user is authenticated
    if (isAuthenticated) {
      // Initial load
      fetchConversations();

      if (!pollingInterval.current) {
        pollingInterval.current = setInterval(() => {
          if (!document.hidden && !fetchInProgress.current) {
            fetchConversations();
            if (activeConversationRef.current) {
              fetchMessages(activeConversationRef.current.id);
            }
          }
        }, 10000); // Poll every 10 seconds
      }
    } else if (pollingInterval.current) {
      // User logged out ― stop polling
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    };
  }, [isAuthenticated]);

  // Delete chat history
  const deleteChatHistory = useCallback(async (conversationId) => {
    if (!isAuthenticated || !user) return;
    
    try {
      await chatService.deleteChatHistory(conversationId);
      // Remove the conversation from the list
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      // If this was the active conversation, clear it
      if (activeConversation?.id === conversationId) {
        handleSetActiveConversation(null);
      }
      toast.success('Chat history deleted successfully');
    } catch (err) {
      const shouldRetry = await handleApiError(err);
      if (shouldRetry) {
        return deleteChatHistory(conversationId);
      }
    }
  }, [user, isAuthenticated, activeConversation, handleSetActiveConversation, refreshToken]);

  // Handle search
  const handleSearch = useCallback(async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await chatService.searchUsers(query);
      setSearchResults(results);
    } catch (err) {
      const shouldRetry = await handleApiError(err);
      if (shouldRetry) {
        return handleSearch(e);
      }
    }
  }, [refreshToken]);

  // Start new conversation
  const startNewConversation = useCallback(async (otherUser, propertyId = null) => {
    try {
      const newConversation = await chatService.startConversation(otherUser.profiles_id, propertyId);
      if (newConversation) {
        setConversations(prev => {
          // Check if conversation already exists in the list
          const exists = prev.some(conv => conv.id === newConversation.id);
          if (!exists) {
            return [newConversation, ...prev];
          }
          return prev;
        });
        handleSetActiveConversation(newConversation);
        setSearchQuery('');
        setSearchResults([]);
        return newConversation;
      }
    } catch (err) {
      const shouldRetry = await handleApiError(err);
      if (shouldRetry) {
        return startNewConversation(otherUser, propertyId);
      }
      throw err;
    }
  }, [handleSetActiveConversation]);

  // Send message with optimistic update
  const sendMessage = useCallback(async (content, conversationId) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to send messages');
      return null;
    }
    
    try {
      // Create optimistic message
      const optimisticMessage = {
        id: 'temp-' + Date.now(),
        content,
        conversation_id: conversationId,
        sender_id: user.id,
        sender: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          profile_photo: user.profile_photo
        },
        created_at: new Date().toISOString(),
        read: false,
        pending: true
      };

      // Add optimistic message to state
      setMessages(prev => [...prev, optimisticMessage]);

      // Immediately update conversation preview & order
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: Array.isArray(conv.messages)
                  ? [...conv.messages, optimisticMessage]
                  : [optimisticMessage],
                last_message: optimisticMessage
              }
            : conv
        );
        return sortConversations(updated);
      });

      const newMessage = await chatService.sendMessage(content, conversationId);
      
      if (newMessage) {
        // Replace optimistic message with real one
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? newMessage : msg
          )
        );
        // Force an immediate fetch of conversations to update the last message
        fetchConversations();
      }
      return newMessage;
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== 'temp-' + Date.now()));
      const shouldRetry = await handleApiError(err);
      if (shouldRetry) {
        return sendMessage(content, conversationId);
      }
    }
  }, [user, isAuthenticated, fetchConversations, refreshToken]);

  // Keep conversation list in sync with messages of the active conversation
  useEffect(() => {
    if (!activeConversation || messages.length === 0) return;

    setConversations(prev => {
      const updated = prev.map(conv =>
        conv.id === activeConversation.id
          ? { ...conv, messages: messages, last_message: messages[messages.length - 1] }
          : conv
      );
      return sortConversations(updated);
    });
  }, [messages, activeConversation]);

  /* ------------------------------------------------------------------
   * WebSocket real-time listeners
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isAuthenticated) return;

    // NEW MESSAGE -----------------------------------------------------
    const unsubscribeNewMsg = websocketService.subscribe('new_message', (msg) => {
      if (!msg) return;

      // If this message is for the currently open conversation, append it
      if (activeConversationRef.current?.id === msg.conversation_id) {
        setMessages((prev) => [...prev, msg]);
        // Immediately mark as read since user is viewing the thread
        markMessagesAsRead(msg.conversation_id);
      }

      // Update conversation list
      setConversations((prev) => {
        let found = false;
        const updated = prev.map((conv) => {
          if (conv.id === msg.conversation_id) {
            found = true;
            const newMsgs = Array.isArray(conv.messages) ? [...conv.messages, msg] : [msg];
            return {
              ...conv,
              messages: newMsgs,
              last_message: msg,
              // Increment unread count locally if not the active conversation and sender is not me
              unread_count:
                activeConversationRef.current?.id === msg.conversation_id || msg.sender_id === user?.id
                  ? 0
                  : (conv.unread_count || 0) + 1,
            };
          }
          return conv;
        });

        if (!found) {
          // Conversation not in local list – fetch the latest list in background
          fetchConversations();
          return prev;
        }
        return sortConversations(updated);
      });
    });

    // NEW CONVERSATION -----------------------------------------------
    const unsubscribeNewConv = websocketService.subscribe('new_conversation', (conv) => {
      if (!conv) return;
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conv.id);
        if (exists) return prev;
        return sortConversations([conv, ...prev]);
      });
    });

    return () => {
      unsubscribeNewMsg?.();
      unsubscribeNewConv?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return {
    loadingConversations,
    loadingMessages,
    error,
    conversations,
    messages,
    activeConversation,
    searchQuery,
    searchResults,
    hasMoreMessages,
    showChat,
    setShowChat,
    handleSearch,
    startNewConversation,
    sendMessage,
    setActiveConversation: handleSetActiveConversation,
    setSearchQuery,
    setSearchResults,
    setError,
    deleteChatHistory,
    markMessagesAsRead,
    fetchConversations,
    fetchMessages,
    setMessages
  };
};