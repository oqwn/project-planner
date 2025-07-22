import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ProjectContext } from '../../contexts/ProjectContext';
import ConversationList from './ConversationList';
import NewConversationModal from './NewConversationModal';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FileUpload } from './FileUpload';
import { apiClient } from '../../utils/apiClient';
import { chatWebSocketService, type ChatMessage as WSChatMessage, type PresenceUpdate } from '../../services/chatWebSocketService';
import './EnhancedChat.css';

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
  const projectContext = useContext(ProjectContext);
  const user = useAuthStore((state) => state.user);

  if (!projectContext) {
    throw new Error('EnhancedChat must be used within ProjectProvider');
  }

  const { selectedProject } = projectContext;
  const projectId = selectedProject?.id;

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
  const [conversationListKey, setConversationListKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Register WebSocket handlers for this component
  useEffect(() => {
    if (!user) return;

    const componentId = `enhanced-chat-${user.email}`;

    // Register message handler
    const messageHandler = (message: WSChatMessage) => {
      // Only add message if it's for the currently selected conversation
      if (message.conversationId === selectedConversationId) {
        setMessages((prev) => [...prev, message]);
      }
      // TODO: Update conversation list with new message preview
    };

    // Register presence handler
    const presenceHandler = (presence: PresenceUpdate) => {
      updateUserPresence(presence);
    };

    // Register connection handler
    const connectionHandler = (connected: boolean) => {
      setIsConnected(connected);
    };

    chatWebSocketService.addMessageHandler(componentId, messageHandler);
    chatWebSocketService.addPresenceHandler(componentId, presenceHandler);
    chatWebSocketService.addConnectionHandler(componentId, connectionHandler);

    return () => {
      // Cleanup handlers when component unmounts
      chatWebSocketService.removeMessageHandler(componentId);
      chatWebSocketService.removePresenceHandler(componentId);
      chatWebSocketService.removeConnectionHandler(componentId);
    };
  }, [user?.email, selectedConversationId]);

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
      const response = await apiClient.get(
        `/api/chat/conversations/${conversationId}`
      );
      const data = await response.json();
      setSelectedConversation(data);
      setOnlineUsers(data.participants || []);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const response = await apiClient.get(
        `/api/chat/conversations/${conversationId}/messages`
      );
      const data = await response.json();
      setMessages(data.reverse()); // Reverse to show oldest first
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
    if (!selectedConversationId) {
      console.warn('Cannot send message: No conversation selected');
      return;
    }

    const success = chatWebSocketService.sendMessage(selectedConversationId, content, mentions);
    if (!success) {
      console.warn('Failed to send message - WebSocket not connected');
      // TODO: Could implement message queueing here
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedConversationId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', selectedConversationId);

    try {
      // For file uploads, we need to handle FormData differently
      const token = user?.token;
      const response = await fetch('http://localhost:20005/api/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
      const response = await apiClient.post('/api/chat/conversations', {
        type,
        participantIds,
        name,
      });

      const newConversation = await response.json();
      setSelectedConversationId(newConversation.id);
      setShowNewConversationModal(false);
      // Refresh conversation list
      setConversationListKey((prev) => prev + 1);
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
    console.log('Starting direct message with userId:', userId);
    console.log('Auth token:', user?.token);
    console.log('Current user:', user);

    try {
      const response = await apiClient.post(
        `/api/chat/conversations/dm/${userId}`
      );

      const conversation = await response.json();
      console.log('Created/fetched conversation:', conversation);
      setSelectedConversationId(conversation.id);
      // Refresh conversation list to show the new conversation
      setConversationListKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error creating DM:', error);
      alert(`Failed to start chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="enhanced-chat-container">
      <ConversationList
        key={conversationListKey}
        currentUserId={user?.email || ''}
        selectedConversationId={selectedConversationId}
        projectId={projectId}
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
