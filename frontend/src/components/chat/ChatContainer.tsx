import React from 'react';
import { useChat } from '../../hooks/useChat';
import { UserList } from './UserList';
import { MessageArea } from './MessageArea';
import { ChatInput } from './ChatInput';
import './ChatContainer.css';

export const ChatContainer: React.FC = () => {  const {
    messages,
    users,
    isConnected,
    isLoading,
    error,
    typingUsers,
    user,
    sendMessage,
    sendTyping,
    clearError,  } = useChat();

  if (!user) {
    return (
      <div className="chat-container">
        <div className="chat-error">
          <p>Debes iniciar sesión para usar el chat</p>
        </div>
      </div>
    );
  }
  return (
    <div className="chat-container">
      {error && (
        <div className="chat-error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-close-btn">
            ×
          </button>
        </div>
      )}

      <div className="chat-content">
        <div className="chat-sidebar">
          <div className="chat-header">
            <h3>Chat General</h3>            <div className="user-info">
              <span className="current-user">Hola {user?.name}</span>
            </div>
          </div>
          <UserList
            users={users}
            currentUserId={user?.id || ''}
            onlineUsers={new Set()}
          />
        </div>        <div className="chat-main">
          <div className="chat-messages-header">
            <h4>Chat Grupal</h4>
            <span className="online-indicator">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          
          <MessageArea
            messages={messages}
            currentUserId={user?.id || ''}
            isLoading={isLoading}
            typingUsers={typingUsers}
          />
          
          <ChatInput
            onSendMessage={sendMessage}
            onTyping={sendTyping}
            disabled={!isConnected}
            placeholder={
              isConnected 
                ? "Escribe un mensaje para todos..."
                : "Conectando al chat..."
            }
          />
        </div>
      </div>

      {!isConnected && (
        <div className="connection-status">
          <div className="connection-indicator">
            <div className="loading-spinner-small"></div>
            <span>Conectando al chat...</span>
          </div>
        </div>
      )}
    </div>
  );
};
