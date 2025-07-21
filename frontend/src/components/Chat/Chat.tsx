import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ProjectContext } from '../../contexts/ProjectContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FileUpload } from './FileUpload';
import { UserList } from './UserList';
import './Chat.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  projectId: string;
  mentions?: string[];
  fileUrl?: string;
  fileName?: string;
}

interface OnlineUser {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
}

export const Chat: React.FC = () => {
  const projectContext = useContext(ProjectContext);
  const user = useAuthStore((state) => state.user);

  if (!projectContext) {
    throw new Error('Chat must be used within ProjectProvider');
  }

  const { selectedProject } = projectContext;
  const projectId = selectedProject?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!projectId || !user) return;

    // Fetch initial messages
    fetchMessages();
    fetchProjectUsers();

    // Set up WebSocket connection
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:20005/ws'),
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);

        // Subscribe to project chat messages
        client.subscribe(`/topic/chat/${projectId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });

        // Subscribe to user presence updates
        client.subscribe(`/topic/presence/${projectId}`, (message) => {
          const userPresence = JSON.parse(message.body);
          updateUserPresence(userPresence);
        });

        // Send user presence
        client.publish({
          destination: '/app/presence',
          body: JSON.stringify({
            userId: user.email,
            projectId,
            isOnline: true,
          }),
        });
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
      if (clientRef.current) {
        // Send offline presence before disconnecting
        clientRef.current.publish({
          destination: '/app/presence',
          body: JSON.stringify({
            userId: user.email,
            projectId,
            isOnline: false,
          }),
        });
        clientRef.current.deactivate();
      }
    };
  }, [projectId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat-messages/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchProjectUsers = async () => {
    try {
      const response = await fetch(`/api/users/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const users = await response.json();
        setOnlineUsers(
          users.map((u: OnlineUser) => ({ ...u, isOnline: false }))
        );
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateUserPresence = (presence: {
    userId: string;
    isOnline: boolean;
  }) => {
    setOnlineUsers((prev) =>
      prev.map((user) =>
        user.id === presence.userId
          ? { ...user, isOnline: presence.isOnline }
          : user
      )
    );
  };

  const sendMessage = (content: string, mentions: string[] = []) => {
    if (!clientRef.current || !isConnected || !user) return;

    const message = {
      content,
      senderId: user.email,
      projectId,
      mentions,
    };

    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId || '');

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <UserList users={onlineUsers} />
      </div>
      <div className="chat-main">
        <div className="chat-header">
          <h2>Project Chat</h2>
          <div
            className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === user?.email}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-area">
          <FileUpload onFileUpload={handleFileUpload} />
          <ChatInput
            onSendMessage={sendMessage}
            users={onlineUsers}
            disabled={!isConnected}
          />
        </div>
      </div>
    </div>
  );
};

