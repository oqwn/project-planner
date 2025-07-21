import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
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

interface ConversationListProps {
  currentUserId: string;
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  currentUserId,
  selectedConversationId,
  onConversationSelect,
  onNewConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
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

      <div className="conversation-search">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="conversations">
        {filteredConversations.length === 0 ? (
          <div className="no-conversations">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
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
        )}
      </div>
    </div>
  );
};

export default ConversationList;
