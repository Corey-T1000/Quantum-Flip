import React from 'react';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.type} mb-2 p-2 rounded`}
          data-status={message.status}
        >
          <span className="timestamp text-xs opacity-50">{message.timestamp}</span>
          <p className="message-text">{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
