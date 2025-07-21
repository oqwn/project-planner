import React, { useState, useEffect } from 'react';
import './NewConversationModal.css';

interface User {
  id: string;
  name: string;
  email: string;
}

interface NewConversationModalProps {
  currentUserId: string;
  projectId?: string;
  onClose: () => void;
  onCreateConversation: (
    type: 'DIRECT_MESSAGE' | 'GROUP_CHAT',
    participantIds: string[],
    name?: string
  ) => void;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  currentUserId,
  projectId,
  onClose,
  onCreateConversation,
}) => {
  const [conversationType, setConversationType] = useState<
    'DIRECT_MESSAGE' | 'GROUP_CHAT'
  >('DIRECT_MESSAGE');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const endpoint = projectId
        ? `/api/projects/${projectId}/members`
        : '/api/users';

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      // Filter out current user
      const filteredUsers = data.filter(
        (user: User) => user.id !== currentUserId
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    if (conversationType === 'DIRECT_MESSAGE') {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    }
  };

  const handleCreate = () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    if (conversationType === 'GROUP_CHAT' && !groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    onCreateConversation(
      conversationType,
      selectedUsers,
      conversationType === 'GROUP_CHAT' ? groupName : undefined
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="new-conversation-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>New Conversation</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="conversation-type-selector">
          <label
            className={conversationType === 'DIRECT_MESSAGE' ? 'selected' : ''}
          >
            <input
              type="radio"
              name="conversationType"
              value="DIRECT_MESSAGE"
              checked={conversationType === 'DIRECT_MESSAGE'}
              onChange={() => {
                setConversationType('DIRECT_MESSAGE');
                setSelectedUsers([]);
                setGroupName('');
              }}
            />
            <span>Direct Message</span>
          </label>
          <label
            className={conversationType === 'GROUP_CHAT' ? 'selected' : ''}
          >
            <input
              type="radio"
              name="conversationType"
              value="GROUP_CHAT"
              checked={conversationType === 'GROUP_CHAT'}
              onChange={() => {
                setConversationType('GROUP_CHAT');
                setSelectedUsers([]);
              }}
            />
            <span>Group Chat</span>
          </label>
        </div>

        {conversationType === 'GROUP_CHAT' && (
          <div className="group-name-input">
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}

        <div className="user-search">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-list">
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-users">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`user-item ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                onClick={() => handleUserToggle(user.id)}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                {conversationType === 'GROUP_CHAT' && (
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => {}}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={handleCreate}
            disabled={
              selectedUsers.length === 0 ||
              (conversationType === 'GROUP_CHAT' && !groupName.trim())
            }
          >
            Create {conversationType === 'DIRECT_MESSAGE' ? 'Chat' : 'Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
