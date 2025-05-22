import React, { useEffect, useRef, useState } from 'react';
import { endpoints } from '../../services/api';
import MessageInput from './MessageInput';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// SVG Icons
const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

function formatDateGroup(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString();
}

const ChatWindow = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  useEffect(() => {
    if (!otherUser) return;
    setLoading(true);
    endpoints
      .getMessages(otherUser.id || otherUser.profile_id)
      .then(res => setMessages(res.data))
      .finally(() => setLoading(false));
  }, [otherUser]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!otherUser || !currentUser) return;
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${otherUser.id || otherUser.profile_id},receiver_id=eq.${currentUser.id}`
        },
        payload => {
          setMessages(prev => [...prev, payload.new]);
          if (payload.new.sender_id !== currentUser.id) {
            toast.info(`New message from ${otherUser.full_name || otherUser.first_name + ' ' + (otherUser.last_name || '')}: ${payload.new.content}`);
          }
          if (Notification.permission === 'granted' && document.visibilityState !== 'visible') {
            new Notification('New message', {
              body: `${otherUser.full_name || otherUser.first_name + ' ' + (otherUser.last_name || '')}: ${payload.new.content}`,
              icon: '/notification-icon.png'
            });
          }
          playNotificationSound();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${currentUser.id},receiver_id=eq.${otherUser.id || otherUser.profile_id}`
        },
        payload => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, otherUser]);

  useEffect(() => {
    if (!otherUser || !currentUser) return;
    const channel = supabase.channel('typing')
      .on('broadcast', { event: 'typing', schema: 'public' }, payload => {
        if (payload.senderId === otherUser.id && payload.receiverId === currentUser.id) {
          setOtherUserTyping(true);
          setTimeout(() => setOtherUserTyping(false), 2000); // Reset after 2s
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentUser, otherUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!otherUser || !currentUser) return;
    if (messages.some(msg => msg.sender_id === otherUser.id && !msg.read)) {
      endpoints.markMessagesRead(otherUser.id);
    }
  }, [messages, otherUser, currentUser]);

  const playNotificationSound = () => {
    const audio = new window.Audio('/notification.mp3');
    audio.play();
  };

  if (window.navigator.vibrate) {
    window.navigator.vibrate(200);
  }

  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  if (!otherUser) {
    return (
      <div className="chat-window-empty">
        <ChatBubbleIcon />
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  let lastDate = null;

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <img 
          src={otherUser.profile_photo || '/img/default-avatar.png'} 
          alt="avatar" 
          className="user-avatar" 
          onError={e => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.first_name + ' ' + (otherUser.last_name || ''))}&background=007bff&color=fff`;
          }}
        />
        <span>{otherUser.full_name || otherUser.first_name + ' ' + (otherUser.last_name || '')}</span>
      </div>
      <div className="chat-window-messages">
        {loading ? (
          <div className="chat-loading">Loading messages...</div>
        ) : (
          messages.map(msg => {
            const msgDate = new Date(msg.created_at).toDateString();
            const showDate = lastDate !== msgDate;
            lastDate = msgDate;
            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="chat-date-separator">{formatDateGroup(msg.created_at)}</div>
                )}
                <div
                  className={`chat-message${msg.sender_id === currentUser.id ? ' sent' : ' received'}`}
                  >
                  <div className="chat-message-content">
                    {msg.content}
                    {msg.file_url && (
                      <div>
                        <img 
                          src={msg.file_url} 
                          alt="attachment" 
                          loading="lazy"
                          onClick={() => window.open(msg.file_url, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                  <div className="chat-message-meta">
                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.sender_id === currentUser.id && (
                      <span title={msg.read ? "Read" : "Sent"} className="message-status">
                        {msg.read ? (
                          <span style={{ color: '#4caf50' }}><CheckIcon /></span>
                        ) : (
                          <span style={{ color: '#b0b0b0' }}><CheckIcon /></span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      {otherUserTyping && (
        <div className="chat-typing-indicator">
          {otherUser.first_name || otherUser.full_name} is typing
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      )}
      <MessageInput currentUser={currentUser} otherUser={otherUser} onSend={msg => setMessages(prev => [...prev, msg])} />
    </div>
  );
};

export default ChatWindow;
