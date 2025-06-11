import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChatContainer } from '../components/chat/ChatContainer';
import './ChatPage.css';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="header-content">          <div className="header-left">
            <button onClick={handleBackToDashboard} className="back-button">
              <i className="fas fa-arrow-left"></i> Volver
            </button>
            <div className="logo">
              <i className="fas fa-comments"></i>
            </div>
            <h1>Chat Grupal</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              <button onClick={handleSignOut} className="sign-out-button">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="chat-main">
        <ChatContainer />
      </main>
    </div>
  );
};
