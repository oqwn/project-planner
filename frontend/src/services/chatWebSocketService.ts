import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
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

export interface ConnectionStats {
  connected: boolean;
  connecting: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

class ChatWebSocketService {
  private client: Client | null = null;
  private reconnectDelay = 5000;
  private maxReconnectDelay = 30000;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private isConnected = false;
  private isConnecting = false;
  private currentUser: { email: string; token: string } | null = null;
  
  // Handler registries
  private messageHandlers: Map<string, (message: ChatMessage) => void> = new Map();
  private presenceHandlers: Map<string, (presence: PresenceUpdate) => void> = new Map();
  private connectionHandlers: Map<string, (connected: boolean) => void> = new Map();
  
  private reconnectTimer: number | null = null;

  /**
   * Connect to WebSocket - Application level, not component level
   */
  async connect(user: { email: string; token: string }): Promise<void> {
    // Prevent multiple connections
    if (this.isConnecting || (this.client && this.client.connected)) {
      console.log('[ChatWS] Already connected or connecting');
      return;
    }

    this.currentUser = user;
    this.isConnecting = true;
    
    console.log('[ChatWS] Connecting to WebSocket...');

    // Clear any pending reconnect
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:20005/ws-chat'),
      connectHeaders: {
        Authorization: `Bearer ${user.token}`,
        userId: user.email,
      },
      debug: (str) => {
        console.log('[ChatWS]', str);
      },
      reconnectDelay: 0, // We handle reconnection manually
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      
      onConnect: () => {
        console.log('[ChatWS] Connected successfully');
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
        this.setupSubscriptions();
        this.sendInitialPresence(true);
      },

      onDisconnect: () => {
        console.log('[ChatWS] Disconnected');
        this.isConnected = false;
        this.isConnecting = false;
        this.notifyConnectionChange(false);
        this.scheduleReconnect();
      },

      onStompError: (frame) => {
        console.error('[ChatWS] STOMP error:', frame.headers?.message || 'Unknown error');
        this.isConnecting = false;
        this.scheduleReconnect();
      },

      onWebSocketError: (error) => {
        console.error('[ChatWS] WebSocket error:', error);
        this.isConnecting = false;
      },
    });

    try {
      this.client.activate();
    } catch (error) {
      console.error('[ChatWS] Failed to activate client:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    console.log('[ChatWS] Disconnecting...');
    
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Send offline presence before disconnecting
    if (this.client && this.client.connected) {
      this.sendInitialPresence(false);
    }

    // Disconnect client
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    // Reset state
    this.isConnected = false;
    this.isConnecting = false;
    this.currentUser = null;
    this.reconnectAttempts = 0;
    
    this.notifyConnectionChange(false);
  }

  /**
   * Send a chat message
   */
  sendMessage(conversationId: string, content: string, mentions: string[] = []): boolean {
    if (!this.client || !this.client.connected) {
      console.warn('[ChatWS] Cannot send message: not connected');
      return false;
    }

    if (!content.trim()) {
      console.warn('[ChatWS] Cannot send empty message');
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
      console.log('[ChatWS] Message sent successfully');
      return true;
    } catch (error) {
      console.error('[ChatWS] Failed to send message:', error);
      return false;
    }
  }

  /**
   * Register handlers - Components register themselves here
   */
  addMessageHandler(id: string, handler: (message: ChatMessage) => void): void {
    this.messageHandlers.set(id, handler);
  }

  removeMessageHandler(id: string): void {
    this.messageHandlers.delete(id);
  }

  addPresenceHandler(id: string, handler: (presence: PresenceUpdate) => void): void {
    this.presenceHandlers.set(id, handler);
  }

  removePresenceHandler(id: string): void {
    this.presenceHandlers.delete(id);
  }

  addConnectionHandler(id: string, handler: (connected: boolean) => void): void {
    this.connectionHandlers.set(id, handler);
    // Immediately notify current state
    handler(this.isConnected);
  }

  removeConnectionHandler(id: string): void {
    this.connectionHandlers.delete(id);
  }

  /**
   * Connection status
   */
  isWebSocketConnected(): boolean {
    return this.isConnected && this.client?.connected === true;
  }

  getConnectionStats(): ConnectionStats {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }

  /**
   * Force reconnect
   */
  forceReconnect(): void {
    console.log('[ChatWS] Force reconnecting...');
    this.disconnect();
    if (this.currentUser) {
      setTimeout(() => {
        this.connect(this.currentUser!);
      }, 1000);
    }
  }

  // Private methods
  private setupSubscriptions(): void {
    if (!this.client || !this.currentUser) return;

    const userEmail = this.currentUser.email;

    // Subscribe to user's messages
    this.client.subscribe(`/topic/user/${userEmail}/messages`, (message) => {
      try {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.notifyMessageHandlers(chatMessage);
      } catch (error) {
        console.error('[ChatWS] Failed to parse message:', error);
      }
    });

    // Subscribe to presence updates
    this.client.subscribe('/topic/presence', (message) => {
      try {
        const presence: PresenceUpdate = JSON.parse(message.body);
        this.notifyPresenceHandlers(presence);
      } catch (error) {
        console.error('[ChatWS] Failed to parse presence:', error);
      }
    });

    console.log('[ChatWS] Subscriptions set up');
  }

  private sendInitialPresence(isOnline: boolean): void {
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
      console.warn('[ChatWS] Failed to send presence:', error);
    }
  }

  private scheduleReconnect(): void {
    // Don't reconnect if user manually disconnected
    if (!this.currentUser) {
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[ChatWS] Max reconnection attempts reached');
      return;
    }

    // Exponential backoff
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    console.log(
      `[ChatWS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`
    );

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectAttempts++;
      if (this.currentUser) {
        this.connect(this.currentUser);
      }
    }, delay);
  }

  private notifyMessageHandlers(message: ChatMessage): void {
    this.messageHandlers.forEach((handler, id) => {
      try {
        handler(message);
      } catch (error) {
        console.error(`[ChatWS] Error in message handler ${id}:`, error);
      }
    });
  }

  private notifyPresenceHandlers(presence: PresenceUpdate): void {
    this.presenceHandlers.forEach((handler, id) => {
      try {
        handler(presence);
      } catch (error) {
        console.error(`[ChatWS] Error in presence handler ${id}:`, error);
      }
    });
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionHandlers.forEach((handler, id) => {
      try {
        handler(connected);
      } catch (error) {
        console.error(`[ChatWS] Error in connection handler ${id}:`, error);
      }
    });
  }
}

// Export singleton instance
export const chatWebSocketService = new ChatWebSocketService();