import { useState, useEffect, useCallback } from 'react';
import type { Message, User, CreateMessageData, TypingData } from '../types/chat';
import { chatSocketService } from '../services/chatSocket';
import { useAuth } from '../context/AuthContext';

export const useChat = () => {
  const { user: authUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());

  // Crear objeto user compatible
  const user = authUser ? {
    id: authUser.id,
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuario',
    email: authUser.email || ''
  } : null;
  // Conectar al chat cuando el usuario esté autenticado
  useEffect(() => {
    if (user && !isConnected) {
      connectToChat();
    }

    return () => {
      chatSocketService.disconnect();
    };
  }, [user?.id]); // Solo cuando cambie el ID del usuario
  // Configurar event listeners
  useEffect(() => {
    if (!isConnected) return;

    // Mensaje nuevo recibido
    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    // Mensajes cargados
    const handleMessagesLoaded = (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
      setIsLoading(false);
    };

    // Usuarios cargados
    const handleUsersLoaded = (loadedUsers: User[]) => {
      // Filtrar el usuario actual de la lista
      const filteredUsers = loadedUsers.filter(u => u.id !== user?.id);
      setUsers(filteredUsers);
    };

    // Usuario escribiendo
    const handleUserTyping = (data: TypingData) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (data.isTyping) {
          newMap.set(data.userId, data.userName);
        } else {
          newMap.delete(data.userId);
        }
        return newMap;
      });

      // Remover el indicador de typing después de 3 segundos
      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            newMap.delete(data.userId);
            return newMap;
          });
        }, 3000);
      }
    };

    // Error de mensaje
    const handleMessageError = (errorData: { error: string }) => {
      setError(errorData.error);
    };

    // Registrar event listeners
    chatSocketService.onNewMessage(handleNewMessage);
    chatSocketService.onMessagesLoaded(handleMessagesLoaded);
    chatSocketService.onUsersLoaded(handleUsersLoaded);
    chatSocketService.onUserTyping(handleUserTyping);
    chatSocketService.onMessageError(handleMessageError);    // Cargar mensajes e usuarios al conectar
    if (isConnected) {
      loadMessages();
      loadUsers();
    }

    // Cleanup
    return () => {
      chatSocketService.off('new_message', handleNewMessage);
      chatSocketService.off('messages_loaded', handleMessagesLoaded);
      chatSocketService.off('users_loaded', handleUsersLoaded);
      chatSocketService.off('user_typing', handleUserTyping);
      chatSocketService.off('message_error', handleMessageError);
    };
  }, [isConnected]); // Solo cuando cambie el estado de conexión
  const connectToChat = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await chatSocketService.connect(user.id, user.name);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to chat:', error);
      setError('Error al conectar con el chat');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = useCallback((content: string) => {
    if (!user || !content.trim()) return;

    const messageData: CreateMessageData = {
      sender_id: user.id,
      content: content.trim(),
    };

    chatSocketService.sendMessage(messageData);
  }, [user]);

  const loadMessages = useCallback(() => {
    setIsLoading(true);
    chatSocketService.getMessages();
  }, []);

  const loadUsers = useCallback(() => {
    chatSocketService.getUsers();
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    chatSocketService.sendTyping(isTyping);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);
  return {
    // Estado
    messages,
    users,
    isConnected,
    isLoading,
    error,
    typingUsers,
    user,
    
    // Acciones
    sendMessage,
    sendTyping,
    loadUsers,
    clearError,
    connectToChat,
  };
};
