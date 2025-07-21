import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ChatInputProps {
  onSendMessage: (content: string, mentions: string[]) => void;
  users: User[];
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  users,
  disabled,
}) => {
  const [message, setMessage] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionStartPos, setMentionStartPos] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  useEffect(() => {
    if (!showMentionList) {
      setSelectedMentionIndex(0);
    }
  }, [showMentionList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setMessage(value);

    // Check for @ symbol
    const lastAtSymbol = value.lastIndexOf('@', cursorPos - 1);
    if (
      lastAtSymbol !== -1 &&
      (lastAtSymbol === 0 || value[lastAtSymbol - 1] === ' ')
    ) {
      const searchText = value.substring(lastAtSymbol + 1, cursorPos);
      if (!searchText.includes(' ')) {
        setMentionSearch(searchText);
        setMentionStartPos(lastAtSymbol);
        setShowMentionList(true);
      } else {
        setShowMentionList(false);
      }
    } else {
      setShowMentionList(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentionList) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (filteredUsers.length > 0) {
          selectMention(filteredUsers[selectedMentionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowMentionList(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectMention = (user: User) => {
    if (mentionStartPos !== -1) {
      const beforeMention = message.substring(0, mentionStartPos);
      const afterMention = message.substring(
        mentionStartPos + mentionSearch.length + 1
      );
      const newMessage = `${beforeMention}@${user.name} ${afterMention}`;
      setMessage(newMessage);
      setShowMentionList(false);

      // Set cursor position after the mention
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = beforeMention.length + user.name.length + 2;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+(?:\s\w+)?)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      const mentions = extractMentions(message);
      onSendMessage(message.trim(), mentions);
      setMessage('');
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={inputRef}
          className="chat-input"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... Use @ to mention someone"
          disabled={disabled}
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
        >
          Send
        </button>
      </div>
      {showMentionList && filteredUsers.length > 0 && (
        <div className="mention-list">
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className={`mention-item ${
                index === selectedMentionIndex ? 'selected' : ''
              }`}
              onClick={() => selectMention(user)}
              onMouseEnter={() => setSelectedMentionIndex(index)}
            >
              <span className="mention-name">{user.name}</span>
              <span className="mention-email">{user.email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
