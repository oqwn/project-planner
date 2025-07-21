import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import ConversationList from './ConversationList';
import NewConversationModal from './NewConversationModal';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FileUpload } from './FileUpload';
import './EnhancedChat.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface FileAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  createdAt: string;
  type: 'TEXT' | 'FILE' | 'IMAGE';
  mentions?: string[];
  attachments?: FileAttachment[];
  isOwnMessage?: boolean;
}

interface ConversationParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  isOnline: boolean;
}

interface Conversation {
  id: string;
  name: string;
  type: 'DIRECT_MESSAGE' | 'GROUP_CHAT';
  participants: ConversationParticipant[];
}

export const EnhancedChat: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ConversationParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] =
    useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!user) return;

    // Set up WebSocket connection
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:20005/ws-chat'),
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);

        // Subscribe to user's conversations
        client.subscribe(`/topic/user/${user.email}/messages`, (message) => {
          const newMessage = JSON.parse(message.body);
          // Only add message if it's for the currently selected conversation
          if (newMessage.conversationId === selectedConversationId) {
            setMessages((prev) => [...prev, newMessage]);
          }
          // TODO: Update conversation list with new message preview
        });

        // Subscribe to presence updates
        client.subscribe('/topic/presence', (message) => {
          const presence = JSON.parse(message.body);
          updateUserPresence(presence);
        });

        // Send online presence
        try {
          client.publish({
            destination: '/app/presence',
            body: JSON.stringify({
              userId: user.email,
              isOnline: true,
            }),
          });
        } catch (error) {
          console.warn('Failed to send presence:', error);
        }
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current && isConnected) {
        try {
          clientRef.current.publish({
            destination: '/app/presence',
            body: JSON.stringify({
              userId: user.email,
              isOnline: false,
            }),
          });
        } catch (error) {
          console.warn('Failed to send offline presence:', error);
        }
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [user, selectedConversationId, isConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchConversationDetails(selectedConversationId);
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  const fetchConversationDetails = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(data);
        setOnlineUsers(data.participants || []);
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.reverse()); // Reverse to show oldest first
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const updateUserPresence = (presence: {
    userId: string;
    isOnline: boolean;
  }) => {
    setOnlineUsers((prev) =>
      prev.map((user) =>
        user.userId === presence.userId
          ? { ...user, isOnline: presence.isOnline }
          : user
      )
    );
  };

  const sendMessage = (content: string, mentions: string[] = []) => {
    if (!clientRef.current || !isConnected || !user || !selectedConversationId)
      return;

    const message = {
      conversationId: selectedConversationId,
      content,
      type: 'TEXT',
      mentions,
    };

    try {
      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedConversationId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', selectedConversationId);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const fileData = await response.json();
        sendMessage(`Shared a file: ${fileData.fileName}`, []);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCreateConversation = async (
    type: 'DIRECT_MESSAGE' | 'GROUP_CHAT',
    participantIds: string[],
    name?: string
  ) => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          type,
          participantIds,
          name,
        }),
      });

      if (response.ok) {
        const newConversation = await response.json();
        setSelectedConversationId(newConversation.id);
        setShowNewConversationModal(false);
        // Refresh conversation list
        window.location.reload(); // TODO: Implement proper refresh
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getConversationTitle = () => {
    if (!selectedConversation) return 'Select a conversation';

    if (selectedConversation.type === 'DIRECT_MESSAGE') {
      const otherParticipant = selectedConversation.participants.find(
        (p) => p.userId !== user?.email
      );
      return otherParticipant?.userName || 'Direct Message';
    }

    return selectedConversation.name;
  };

  const handleStartDirectMessage = async (userId: string) => {
    try {
      const response = await fetch(`/api/chat/conversations/dm/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversationId(conversation.id);
        // Refresh conversation list
        window.location.reload(); // TODO: Implement proper refresh
      }
    } catch (error) {
      console.error('Error creating DM:', error);
    }
  };

  return (
    <div className="enhanced-chat-container">
      <ConversationList
        currentUserId={user?.email || ''}
        selectedConversationId={selectedConversationId}
        onConversationSelect={setSelectedConversationId}
        onNewConversation={() => setShowNewConversationModal(true)}
        onStartDirectMessage={handleStartDirectMessage}
      />

      <div className="chat-main">
        {selectedConversationId ? (
          <>
            <div className="chat-header">
              <h2>{getConversationTitle()}</h2>
              <div
                className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            <div className="chat-messages">
              {loadingMessages ? (
                <div className="loading-messages">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="no-messages">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={{
                      id: message.id,
                      content: message.content,
                      senderId: message.senderId,
                      senderName: message.senderName,
                      timestamp: message.createdAt,
                      projectId: '', // Not used in enhanced chat
                      mentions: message.mentions,
                    }}
                    isOwnMessage={
                      message.isOwnMessage || message.senderId === user?.email
                    }
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <FileUpload onFileUpload={handleFileUpload} />
              <ChatInput
                onSendMessage={sendMessage}
                users={onlineUsers.map((p) => ({
                  id: p.userId,
                  name: p.userName,
                  email: p.userEmail,
                  isOnline: p.isOnline,
                }))}
                disabled={!isConnected}
              />
            </div>
          </>
        ) : (
          <div className="no-conversation-selected">
            <h2>Welcome to Chat</h2>
            <p>Select a conversation from the list or start a new one</p>
          </div>
        )}
      </div>

      {showNewConversationModal && (
        <NewConversationModal
          currentUserId={user?.email || ''}
          onClose={() => setShowNewConversationModal(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}
    </div>
  );
};
