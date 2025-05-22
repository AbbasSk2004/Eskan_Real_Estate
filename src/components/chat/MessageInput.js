import React, { useState, useRef } from 'react';
import { endpoints } from '../../services/api';
import { createClient } from '@supabase/supabase-js';
import Picker from '@emoji-mart/react';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// SVG Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const EmojiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

const AttachmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const broadcastTyping = (currentUser, otherUser) => {
  if (!currentUser || !otherUser) return;
  supabase.channel('typing').send({
    type: 'broadcast',
    event: 'typing',
    payload: {
      senderId: currentUser.id,
      receiverId: otherUser.id
    }
  });
};

const MessageInput = ({ currentUser, otherUser, onSend }) => {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!value.trim() && !file) || !otherUser) return;
    setSending(true);
    try {
      let fileUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await endpoints.uploadChatFile(formData);
        fileUrl = res.data.url;
      }
      const content = value.trim();
      const messagePayload = { receiver_id: otherUser.id || otherUser.profile_id, content };
      if (fileUrl) messagePayload.file_url = fileUrl;
      const res = await endpoints.sendMessage(messagePayload);
      onSend(res.data);
      setValue('');
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {file && (
        <div className="file-preview">
          {filePreview ? (
            <img src={filePreview} alt="Preview" />
          ) : (
            <span>File: {file.name}</span>
          )}
          <button className="remove-file" onClick={removeFile} aria-label="Remove file">
            <CloseIcon />
          </button>
        </div>
      )}
      <form className="message-input" onSubmit={handleSend} encType="multipart/form-data">
        <input
          type="text"
          placeholder={otherUser ? "Type a message..." : "Select a user to start chatting"}
          value={value}
          onChange={e => {
            setValue(e.target.value);
            broadcastTyping(currentUser, otherUser);
          }}
          disabled={!otherUser || sending}
          aria-label="Message input"
        />
        
        <div className="file-input-wrapper">
          <button 
            type="button" 
            className="file-button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={!otherUser || sending}
            aria-label="Attach file"
          >
            <AttachmentIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!otherUser || sending}
            aria-label="File input"
          />
        </div>
        
        <button 
          type="button" 
          className="emoji-button" 
          onClick={() => setShowEmojiPicker(v => !v)}
          disabled={!otherUser || sending}
          aria-label="Emoji picker"
        >
          <EmojiIcon />
        </button>
        
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <Picker onEmojiSelect={emoji => setValue(value + emoji.native)} />
          </div>
        )}
        
        <button 
          type="submit" 
          className="send-button" 
          disabled={!otherUser || sending || (!value.trim() && !file)}
          aria-label="Send message"
        >
          Send <SendIcon />
        </button>
      </form>
    </>
  );
};

export default MessageInput;
