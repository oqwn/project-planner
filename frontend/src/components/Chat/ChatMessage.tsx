import React from 'react';
import './ChatMessage.css';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    senderId?: string;
    senderName: string;
    timestamp: string;
    projectId?: string;
    mentions?: string[];
    fileUrl?: string;
    fileName?: string;
    status?: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  };
  isOwnMessage: boolean;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
  onRetry,
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderContent = () => {
    let content = message.content;

    // Highlight mentions
    if (message.mentions && message.mentions.length > 0) {
      message.mentions.forEach((mention) => {
        content = content.replace(
          new RegExp(`@${mention}`, 'g'),
          `<span class="mention">@${mention}</span>`
        );
      });
    }

    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const getStatusIcon = () => {
    if (!isOwnMessage || !message.status) return null;

    switch (message.status) {
      case 'PENDING':
        return <span className="status-icon pending">⏳</span>;
      case 'SENT':
        return <span className="status-icon sent">✓</span>;
      case 'DELIVERED':
        return <span className="status-icon delivered">✓✓</span>;
      case 'READ':
        return <span className="status-icon read">✓✓</span>;
      case 'FAILED':
        return <span className="status-icon failed">❌</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`chat-message ${isOwnMessage ? 'own-message' : ''} ${message.status === 'FAILED' ? 'failed' : ''}`}
    >
      <div className="message-header">
        <span className="sender-name">{message.senderName}</span>
        <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
      </div>
      <div className="message-content">
        {renderContent()}
        {message.fileUrl && (
          <div className="file-attachment">
            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
              📎 {message.fileName}
            </a>
          </div>
        )}
        {isOwnMessage && (
          <div className="message-status">
            {getStatusIcon()}
            {message.status === 'FAILED' && onRetry && (
              <button className="retry-button" onClick={onRetry}>
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
