import React from 'react';
import './UserList.css';

interface User {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
}

interface UserListProps {
  users: User[];
}

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const onlineUsers = users.filter((user) => user.isOnline);
  const offlineUsers = users.filter((user) => !user.isOnline);

  return (
    <div className="user-list">
      <h3>Team Members</h3>

      {onlineUsers.length > 0 && (
        <div className="user-section">
          <h4>Online ({onlineUsers.length})</h4>
          {onlineUsers.map((user) => (
            <div key={user.id} className="user-item online">
              <span className="status-indicator online-indicator"></span>
              <span className="user-name">{user.name}</span>
            </div>
          ))}
        </div>
      )}

      {offlineUsers.length > 0 && (
        <div className="user-section">
          <h4>Offline ({offlineUsers.length})</h4>
          {offlineUsers.map((user) => (
            <div key={user.id} className="user-item offline">
              <span className="status-indicator offline-indicator"></span>
              <span className="user-name">{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

