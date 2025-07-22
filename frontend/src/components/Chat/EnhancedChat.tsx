import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ProjectContext } from '../../contexts/ProjectContext';
import ConversationList from './ConversationList';
import NewConversationModal from './NewConversationModal';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FileUpload } from './FileUpload';
import { apiClient } from '../../utils/apiClient';
import {
  chatWebSocketService,
  type ChatMessage as WSChatMessage,
  type PresenceUpdate,
} from '../../services/chatWebSocketService';
import chatApiService from '../../services/chatApiService';
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
  status?: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  clientMessageId?: string;
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
  const conversationListRef = useRef<{ refreshConversations: () => void }>(null);

  // Register WebSocket handlers for this component
  useEffect(() => {
    if (!user) return;

    const componentId = `enhanced-chat-${user.email}`;

    // Register message handler
    const messageHandler = (message: WSChatMessage) => {
      // Only add message if it's for the currently selected conversation
      if (message.conversationId === selectedConversationId) {
        setMessages((prev) => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some(
            (m) => m.id === message.id || m.clientMessageId === message.id
          );
          if (exists) {
            // Update existing message
            return prev.map((m) =>
              m.id === message.id || m.clientMessageId === message.id
                ? { ...message, isOwnMessage: message.senderEmail === user?.email }
                : m
            );
          }
          // Add new message
          return [
            ...prev,
            { ...message, isOwnMessage: message.senderEmail === user?.email },
          ];
        });

        // Note: Using simple conversation-level read tracking like WhatsApp/WeChat
        // No need for individual message delivery tracking
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
        `/api/conversations/${conversationId}`
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
      const result = await chatApiService.getMessages(conversationId);
      const messagesWithStatus = result.content.map((msg) => ({
        ...msg,
        isOwnMessage: msg.senderEmail === user?.email,
      }));
      setMessages(messagesWithStatus.reverse()); // Reverse to show oldest first

      // Mark conversation as read immediately
      chatApiService.markConversationAsRead(conversationId).then(() => {
        // Refresh conversation list to update unread count
        if (conversationListRef.current) {
          conversationListRef.current.refreshConversations();
        }
      });
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

  const sendMessage = async (content: string, mentions: string[] = []) => {
    if (!selectedConversationId) {
      console.warn('Cannot send message: No conversation selected');
      return;
    }

    // Generate a client message ID for tracking
    const clientMessageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: clientMessageId,
      conversationId: selectedConversationId,
      content,
      senderId: user?.email || '',
      senderName: user?.name || '',
      senderEmail: user?.email || '',
      createdAt: new Date().toISOString(),
      type: 'TEXT',
      mentions,
      isOwnMessage: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      // Send via HTTP for reliability
      const response = await chatApiService.sendMessage(
        selectedConversationId,
        {
          content,
          type: 'TEXT',
          mentions,
          clientMessageId,
          projectId: projectId || undefined,
        }
      );

      // Update message with server ID
      if (response.status === 'sent') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === clientMessageId
              ? { ...msg, id: response.messageId }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mark message as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === clientMessageId
            ? { ...msg, status: 'FAILED' as const }
            : msg
        )
      );
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedConversationId) return;

    try {
      const response = await chatApiService.uploadMedia(
        selectedConversationId,
        file,
        `Shared a file: ${file.name}`
      );

      if (response.status === 'success') {
        // Message is automatically created by the backend
        console.log('File uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const retryMessage = async (message: Message) => {
    try {
      // Update message status to pending
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: 'PENDING' as const } : msg
        )
      );

      const response = await chatApiService.retryMessage(message.id);

      if (response.status === 'sent') {
        // Update message with successful send
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, status: 'SENT' as const } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to retry message:', error);
      // Revert to failed status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: 'FAILED' as const } : msg
        )
      );
    }
  };

  const handleCreateConversation = async (
    type: 'DIRECT_MESSAGE' | 'GROUP_CHAT',
    participantIds: string[],
    name?: string
  ) => {
    try {
      const response = await apiClient.post('/api/conversations', {
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
        `/api/conversations/direct-message/${userId}`
      );

      const conversation = await response.json();
      console.log('Created/fetched conversation:', conversation);
      setSelectedConversationId(conversation.id);
      // Refresh conversation list to show the new conversation
      setConversationListKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error creating DM:', error);
      alert(
        `Failed to start chat: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return (
    <div className="enhanced-chat-container">
      <ConversationList
        ref={conversationListRef}
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
                      status: message.status,
                    }}
                    isOwnMessage={
                      message.isOwnMessage || message.senderEmail === user?.email
                    }
                    onRetry={
                      message.status === 'FAILED'
                        ? () => retryMessage(message)
                        : undefined
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
