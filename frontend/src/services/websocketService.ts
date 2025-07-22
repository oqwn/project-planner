import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebSocketMessage {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  createdAt: string;
  type: 'TEXT' | 'FILE' | 'IMAGE';
  mentions?: string[];
  isOwnMessage?: boolean;
}

export interface PresenceUpdate {
  userId: string;
  isOnline: boolean;
}

interface WebSocketServiceCallbacks {
  onMessage: (message: WebSocketMessage) => void;
  onPresenceUpdate: (presence: PresenceUpdate) => void;
  onConnectionChange: (connected: boolean) => void;
}

class WebSocketService {
  private client: Client | null = null;
  private callbacks: WebSocketServiceCallbacks | null = null;
  private currentUser: { email: string; token: string } | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private isConnecting = false;
  private isManuallyDisconnected = false;

  connect(user: { email: string; token: string }, callbacks: WebSocketServiceCallbacks) {
    // Prevent multiple simultaneous connections
    if (this.isConnecting || (this.client && this.client.connected)) {
      console.log('WebSocket already connecting or connected');
      return;
    }

    this.currentUser = user;
    this.callbacks = callbacks;
    this.isManuallyDisconnected = false;
    this.isConnecting = true;

    console.log('Connecting to WebSocket...');

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:20005/ws-chat'),
      connectHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 0, // We handle reconnection manually
      heartbeatIncoming: 10000, // Expect heartbeat every 10 seconds
      heartbeatOutgoing: 10000, // Send heartbeat every 10 seconds
      
      onConnect: () => {
        console.log('WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        
        if (this.callbacks) {
          this.callbacks.onConnectionChange(true);
        }

        // Subscribe to user's messages
        this.client!.subscribe(`/topic/user/${user.email}/messages`, (message) => {
          try {
            const newMessage: WebSocketMessage = JSON.parse(message.body);
            if (this.callbacks) {
              this.callbacks.onMessage(newMessage);
            }
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });

        // Subscribe to presence updates
        this.client!.subscribe('/topic/presence', (message) => {
          try {
            const presence: PresenceUpdate = JSON.parse(message.body);
            if (this.callbacks) {
              this.callbacks.onPresenceUpdate(presence);
            }
          } catch (error) {
            console.error('Failed to parse presence update:', error);
          }
        });

        // Send initial presence
        this.sendPresence(true);
        
        // Start heartbeat
        this.startHeartbeat();
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        
        if (this.callbacks) {
          this.callbacks.onConnectionChange(false);
        }
        
        this.stopHeartbeat();
        
        // Attempt reconnection if not manually disconnected
        if (!this.isManuallyDisconnected) {
          this.scheduleReconnect();
        }
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        this.isConnecting = false;
        
        if (this.callbacks) {
          this.callbacks.onConnectionChange(false);
        }
        
        // Attempt reconnection on error
        if (!this.isManuallyDisconnected) {
          this.scheduleReconnect();
        }
      },

      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      },
    });

    try {
      this.client.activate();
    } catch (error) {
      console.error('Failed to activate WebSocket client:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  disconnect() {
    console.log('Manually disconnecting WebSocket...');
    this.isManuallyDisconnected = true;
    
    // Clear any pending reconnection
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    // Send offline presence before disconnecting
    if (this.client && this.client.connected) {
      this.sendPresence(false);
    }
    
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.error('Error during disconnect:', error);
      }
      this.client = null;
    }
    
    this.isConnecting = false;
    
    if (this.callbacks) {
      this.callbacks.onConnectionChange(false);
    }
  }

  sendMessage(conversationId: string, content: string, mentions: string[] = []) {
    if (!this.client || !this.client.connected) {
      console.warn('Cannot send message: WebSocket not connected');
      return false;
    }

    if (!content.trim()) {
      console.warn('Cannot send empty message');
      return false;
    }

    const message = {
      conversationId,
      content: content.trim(),
      type: 'TEXT',
      mentions,
    };

    try {
      this.client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message),
      });
      console.log('Message sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  isConnected(): boolean {
    return this.client ? this.client.connected : false;
  }

  private sendPresence(isOnline: boolean) {
    if (!this.client || !this.client.connected || !this.currentUser) {
      return;
    }

    try {
      this.client.publish({
        destination: '/app/presence',
        body: JSON.stringify({
          userId: this.currentUser.email,
          isOnline,
        }),
      });
    } catch (error) {
      console.warn('Failed to send presence:', error);
    }
  }

  private scheduleReconnect() {
    if (this.isManuallyDisconnected || this.reconnectTimer) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached, giving up');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isManuallyDisconnected && this.currentUser && this.callbacks) {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect(this.currentUser, this.callbacks);
      }
    }, delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    
    // Send heartbeat every 30 seconds
    this.heartbeatTimer = setInterval(() => {
      if (this.client && this.client.connected) {
        this.sendPresence(true);
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();