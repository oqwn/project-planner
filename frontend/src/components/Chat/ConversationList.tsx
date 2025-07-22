import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import './ConversationList.css';

interface ConversationParticipant {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: string;
  lastReadAt?: string;
  isOnline: boolean;
}

interface Conversation {
  id: string;
  name: string;
  type: 'DIRECT_MESSAGE' | 'GROUP_CHAT';
  projectId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  participants: ConversationParticipant[];
  avatarUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ConversationListProps {
  currentUserId: string;
  selectedConversationId?: string;
  projectId?: string;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  onStartDirectMessage?: (userId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  currentUserId,
  selectedConversationId,
  projectId,
  onConversationSelect,
  onNewConversation,
  onStartDirectMessage,
}) => {
  const user = useAuthStore((state) => state.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'users'>(
    'conversations'
  );

  useEffect(() => {
    fetchConversations();
    fetchAvailableUsers();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      console.log('Auth token from user store:', user?.token);
      console.log('ProjectId:', projectId);

      // If we have a projectId, fetch project members; otherwise fetch all users
      const endpoint = projectId
        ? `/api/projects/${projectId}/members`
        : '/api/users';

      console.log('Fetching from endpoint:', endpoint);

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched users:', data);
      console.log('Current user ID (email):', currentUserId);

      // Transform data based on endpoint
      let users: User[] = [];
      if (projectId && data.length > 0 && data[0].userId) {
        // Project members endpoint returns different structure
        users = data.map((member: { userId: string; userName: string; userEmail: string }) => ({
          id: member.userId,
          name: member.userName,
          email: member.userEmail,
        }));
      } else {
        users = data;
      }

      // Filter out current user
      const filteredUsers = users.filter(
        (user: User) => user.email !== currentUserId
      );
      console.log('Filtered users:', filteredUsers);
      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getConversationDisplayName = (conversation: Conversation): string => {
    if (conversation.type === 'DIRECT_MESSAGE') {
      // For DMs, show the other participant's name
      const otherParticipant = conversation.participants.find(
        (p) => p.userId !== currentUserId
      );
      return otherParticipant?.userName || 'Unknown User';
    }
    return conversation.name;
  };

  const getConversationAvatar = (conversation: Conversation): string => {
    if (conversation.avatarUrl) {
      return conversation.avatarUrl;
    }

    // Generate initials-based avatar
    const name = getConversationDisplayName(conversation);
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23${stringToColor(name)}"/><text x="50%" y="50%" dy="0.1em" text-anchor="middle" fill="white" font-family="Arial" font-size="16">${initials}</text></svg>`;
  };

  const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`.replace('#', '');
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = getConversationDisplayName(conv).toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="conversation-list loading">
        <div className="loading-spinner">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Chats</h2>
        <button
          className="new-conversation-btn"
          onClick={onNewConversation}
          title="New conversation"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 5v10M5 10h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'conversations' ? 'active' : ''}`}
          onClick={() => setActiveTab('conversations')}
        >
          Conversations
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Team Members
        </button>
      </div>

      <div className="conversation-search">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="conversations">
        {activeTab === 'conversations' ? (
          filteredConversations.length === 0 ? (
            <div className="no-conversations">
              {searchTerm
                ? 'No conversations found'
                : 'No conversations yet. Click the Team Members tab to start chatting!'}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversationId === conversation.id ? 'selected' : ''}`}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <div className="conversation-avatar">
                  <img src={getConversationAvatar(conversation)} alt="" />
                  {conversation.type === 'DIRECT_MESSAGE' &&
                    conversation.participants.find(
                      (p) => p.userId !== currentUserId
                    )?.isOnline && <div className="online-indicator"></div>}
                </div>

                <div className="conversation-content">
                  <div className="conversation-header">
                    <h3>{getConversationDisplayName(conversation)}</h3>
                    {conversation.lastMessageAt && (
                      <span className="last-message-time">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessageAt),
                          { addSuffix: true }
                        )}
                      </span>
                    )}
                  </div>

                  <div className="conversation-preview">
                    <p className="last-message">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-badge">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          // Users tab
          <div className="available-users">
            {loading ? (
              <div className="loading">Loading team members...</div>
            ) : availableUsers.length === 0 ? (
              <div className="no-users">No team members found</div>
            ) : (
              availableUsers
                .filter(
                  (user) =>
                    user.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="user-item"
                    onClick={() => {
                      console.log('User clicked:', user);
                      console.log('User ID:', user.id);
                      if (onStartDirectMessage) {
                        onStartDirectMessage(user.id);
                      }
                    }}
                  >
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
