import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = "Escribe un mensaje...",
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Focus input cuando el componente se monta
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Manejar indicador de typing
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Establecer nuevo timeout para dejar de escribir
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Limpiar indicador de typing
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
      
      // Limpiar timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="chat-input-container">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="chat-input"
          maxLength={1000}
        />        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="chat-send-button"
          title="Enviar mensaje"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
