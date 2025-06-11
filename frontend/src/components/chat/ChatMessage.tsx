import type { Message } from '../../types/chat';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUserId }) => {
  const isOwnMessage = message.sender_id === currentUserId;
  const messageDate = new Date(message.created_at);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  return (
    <div className={`chat-message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-content">
        {!isOwnMessage && (
          <div className="message-sender">{message.sender_name}</div>
        )}
        <div className="message-text">{message.content}</div>
        <div className="message-time">
          {formatDate(messageDate)} {formatTime(messageDate)}
        </div>
      </div>
    </div>
  );
};
