import React, { useEffect, useRef } from 'react';
import type { Message } from '../../types/chat';
import { ChatMessage } from './ChatMessage';
import './MessageArea.css';

interface MessageAreaProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  typingUsers: Map<string, string>;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  currentUserId,
  isLoading = false,
  typingUsers,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Verificar si hay usuarios escribiendo (excluyendo al usuario actual)
  const typingUsersList = Array.from(typingUsers.entries()).filter(([userId]) => userId !== currentUserId);
  const isTypingIndicatorVisible = typingUsersList.length > 0;

  return (
    <div className="message-area">
      <div className="messages-container">
        {isLoading ? (
          <div className="loading-messages">
            <div className="loading-spinner"></div>
            <p>Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
            ))}
            
            {isTypingIndicatorVisible && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">
                  {typingUsersList.length === 1 
                    ? `${typingUsersList[0][1]} está escribiendo...`
                    : `${typingUsersList.length} usuarios están escribiendo...`
                  }
                </span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
