import { io, Socket } from 'socket.io-client';
import type { Message, User, CreateMessageData, TypingData } from '../types/chat';

class ChatSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  connect(userId: string, userName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Si ya está conectado con el mismo usuario, no reconectar
        if (this.isConnected && this.socket?.connected) {
          resolve(true);
          return;
        }

        if (this.socket) {
          this.disconnect();
        }

        this.socket = io('http://localhost:3000/chat', {
          transports: ['websocket'],
          forceNew: true,
        });

        this.socket.on('connect', () => {
          console.log('Connected to chat server');
          this.isConnected = true;
          
          // Autenticar usuario
          this.socket!.emit('authenticate', { userId, userName });
        });

        this.socket.on('authenticated', (data: { success: boolean; error?: string }) => {
          if (data.success) {
            console.log('User authenticated successfully');
            resolve(true);
          } else {
            console.error('Authentication failed:', data.error);
            reject(new Error(data.error || 'Authentication failed'));
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from chat server');
          this.isConnected = false;
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Enviar mensaje
  sendMessage(messageData: CreateMessageData): void {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }
  // Obtener mensajes
  getMessages(): void {
    if (this.socket) {
      this.socket.emit('get_messages');
    }
  }

  // Obtener usuarios
  getUsers(): void {
    if (this.socket) {
      this.socket.emit('get_users');
    }
  }

  // Indicar que está escribiendo
  sendTyping(isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { isTyping });
    }
  }
  // Event listeners
  onNewMessage(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessagesLoaded(callback: (messages: Message[]) => void): void {
    if (this.socket) {
      this.socket.on('messages_loaded', callback);
    }
  }

  onUsersLoaded(callback: (users: User[]) => void): void {
    if (this.socket) {
      this.socket.on('users_loaded', callback);
    }
  }

  onUserTyping(callback: (data: TypingData) => void): void {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserConnected(callback: (data: { userId: string; userName: string }) => void): void {
    if (this.socket) {
      this.socket.on('user_connected', callback);
    }
  }

  onUserDisconnected(callback: (data: { userId: string; userName: string }) => void): void {
    if (this.socket) {
      this.socket.on('user_disconnected', callback);
    }
  }

  onMessageError(callback: (error: { error: string }) => void): void {
    if (this.socket) {
      this.socket.on('message_error', callback);
    }
  }

  // Cleanup event listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const chatSocketService = new ChatSocketService();
