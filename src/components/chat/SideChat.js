import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import './SideChat.css';

// SVG Icons
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SideChat = ({ open, onClose, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMobileButton, setShowMobileButton] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setShowMobileButton(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!open) {
    return showMobileButton ? (
      <button 
        className="mobile-chat-button" 
        onClick={(e) => {
          e.stopPropagation();
          onClose(false);
        }}
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>
    ) : null;
  }

  return (
    <div className="side-chat-overlay" onClick={onClose}>
      <div className="side-chat-panel" onClick={e => e.stopPropagation()}>
        <div className="side-chat-header">
          <span>Direct Messages</span>
          <button className="close-btn" onClick={onClose} aria-label="Close chat">
            <CloseIcon />
          </button>
        </div>
        <div className="side-chat-body">
          <UserList currentUser={currentUser} onSelectUser={setSelectedUser} selectedUser={selectedUser} />
          <ChatWindow currentUser={currentUser} otherUser={selectedUser} />
        </div>
      </div>
    </div>
  );
};

export default SideChat;
