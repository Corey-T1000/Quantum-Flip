import { useState, useCallback } from 'react';
import { Message } from '../types';

export const useTerminal = (maxMessages = 100) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((
    text: string,
    type: Message['type'] = 'system',
    status = 'success'
  ) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      type,
      status,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      return updated.slice(-maxMessages); // Keep only the last maxMessages
    });
  }, [maxMessages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const updateLastMessage = useCallback((
    text: string,
    status: string = 'success'
  ) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const lastMessage = { ...updated[updated.length - 1] };
      lastMessage.text = text;
      lastMessage.status = status;
      updated[updated.length - 1] = lastMessage;
      return updated;
    });
  }, []);

  return {
    messages,
    addMessage,
    clearMessages,
    updateLastMessage
  };
};

export default useTerminal;
