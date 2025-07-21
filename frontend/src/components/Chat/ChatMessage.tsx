import React from 'react';
import './ChatMessage.css';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    senderName: string;
    timestamp: string;
    mentions?: string[];
    fileUrl?: string;
    fileName?: string;
  };
  isOwnMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
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

  return (
    <div className={`chat-message ${isOwnMessage ? 'own-message' : ''}`}>
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
      </div>
    </div>
  );
};

