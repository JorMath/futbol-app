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
        <div className="chat-sidebar">          <div className="chat-header">
            <h3>Chat General</h3>
          </div>
          <UserList
            users={users}
            currentUserId={user?.id || ''}
            onlineUsers={new Set()}
          />
        </div>        <div className="chat-main">
          <div className="chat-messages-header">
            <h4>Chat Grupal</h4>
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

      {/* Indicador de conexión fijo en esquina inferior derecha */}
      <div className="connection-status-fixed">
        <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <i className={`fas fa-wifi ${isConnected ? 'connected-icon' : 'disconnected-icon'}`}></i>
          <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
        </div>
      </div>
    </div>
  );
};
