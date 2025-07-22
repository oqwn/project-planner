import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:20005/api';

interface MessageSendRequest {
  content: string;
  type?: 'TEXT' | 'FILE' | 'IMAGE';
  mentions?: string[];
  replyToMessageId?: string;
  clientMessageId?: string;
  projectId?: string;
}

interface MessageDeliveryResponse {
  messageId: string;
  clientMessageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  error?: string;
}

interface MediaUploadResponse {
  messageId: string;
  mediaUrl: string;
  status: string;
  error?: string;
}

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
  status?: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  clientMessageId?: string;
}

class ChatApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Send a message via HTTP
   */
  async sendMessage(
    conversationId: string,
    request: MessageSendRequest
  ): Promise<MessageDeliveryResponse> {
    try {
      const response = await axios.post<MessageDeliveryResponse>(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Get message history with pagination
   */
  async getMessages(
    conversationId: string,
    page: number = 0,
    size: number = 50,
    before?: string,
    after?: string
  ): Promise<{
    content: ChatMessage[];
    totalElements: number;
    hasMore: boolean;
  }> {
    try {
      const params: Record<string, string | number> = { page, size };
      if (before) params.before = before;
      if (after) params.after = after;

      const response = await axios.get(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: this.getAuthHeaders(),
          params,
        }
      );

      return {
        content: response.data.content,
        totalElements: response.data.totalElements,
        hasMore: !response.data.last,
      };
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Mark messages as delivered
   */
  async markMessagesDelivered(messageIds: string[]): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/chat/messages/delivered`,
        { messageIds },
        { headers: this.getAuthHeaders() }
      );
    } catch (error) {
      console.error('Failed to mark messages as delivered:', error);
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesRead(messageIds: string[]): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/chat/messages/read`,
        { messageIds },
        { headers: this.getAuthHeaders() }
      );
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }

  /**
   * Mark conversation as read (updates conversation-level read timestamp)
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/conversations/${conversationId}/mark-read`,
        {},
        { headers: this.getAuthHeaders() }
      );
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(
    conversationId: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/chat/conversations/${conversationId}/typing`,
        { isTyping },
        { headers: this.getAuthHeaders() }
      );
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }

  /**
   * Get undelivered messages (for offline sync)
   */
  async getUndeliveredMessages(): Promise<ChatMessage[]> {
    try {
      const response = await axios.get<ChatMessage[]>(
        `${API_BASE_URL}/chat/messages/undelivered`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get undelivered messages:', error);
      return [];
    }
  }

  /**
   * Retry failed message
   */
  async retryMessage(messageId: string): Promise<MessageDeliveryResponse> {
    try {
      const response = await axios.post<MessageDeliveryResponse>(
        `${API_BASE_URL}/chat/messages/${messageId}/retry`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to retry message:', error);
      throw error;
    }
  }

  /**
   * Upload media file
   */
  async uploadMedia(
    conversationId: string,
    file: File,
    caption?: string
  ): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (caption) {
        formData.append('caption', caption);
      }

      const response = await axios.post<MediaUploadResponse>(
        `${API_BASE_URL}/chat/conversations/${conversationId}/media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to upload media:', error);
      throw error;
    }
  }
}

export default new ChatApiService();
