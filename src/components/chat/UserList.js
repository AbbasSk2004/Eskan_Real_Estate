import React, { useEffect, useState } from 'react';
import { endpoints } from '../../services/api';
import { createClient } from '@supabase/supabase-js';

// SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UserList = ({ currentUser, onSelectUser, selectedUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
  );
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        // Fetch all profiles except current user
        const res = await endpoints.getProfiles();
        console.log('Fetched profiles:', res.data, 'Current user:', currentUser);
        let profiles = res.data || [];
        profiles = profiles.filter(u => u.id !== currentUser?.id);
        setUsers(profiles);
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    
    const channel = supabase.channel('user-presence', {
      config: { presence: { key: currentUser?.id } }
    });
    
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        channel.track({ user_id: currentUser?.id });
      }
    });
    
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      // state is { [userId]: [{ user_id: ... }] }
      const online = {};
      Object.keys(state).forEach(uid => { online[uid] = true; });
      setOnlineUsers(online);
    });
    
    return () => supabase.removeChannel(channel);
  }, [currentUser]);

  const filtered = users.filter(u => {
    const name = (u.first_name || '') + ' ' + (u.last_name || '');
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="user-list">
      <div className="user-list-search-wrapper">
        <span className="user-list-search-icon" aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="user-list-search"
          aria-label="Search users"
        />
      </div>
      
      <div className="user-list-items">
        {loading ? (
          <div className="user-list-loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="user-list-empty">No users found</div>
        ) : (
          filtered.map(user => {
            const name = (user.first_name || '') + ' ' + (user.last_name || '');
            return (
              <div
                key={user.id}
                className={`user-list-item${selectedUser && selectedUser.id === user.id ? ' selected' : ''}`}
                onClick={() => onSelectUser(user)}
                aria-selected={selectedUser && selectedUser.id === user.id}
                role="option"
              >
                <img
                  src={user.profile_photo || ''}
                  alt={`${name} avatar`}
                  className="user-avatar"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + (user.last_name || ''))}&background=007bff&color=fff`;
                  }}
                />
                <span>{name}</span>
                <span
                  className={`user-presence-dot ${onlineUsers[user.id] ? 'online' : 'offline'}`}
                  title={onlineUsers[user.id] ? 'Online' : 'Offline'}
                  aria-label={onlineUsers[user.id] ? 'Online' : 'Offline'}
                ></span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserList;
