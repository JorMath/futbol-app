import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  },
  namespace: '/chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, AuthenticatedSocket>();

  constructor(private readonly chatService: ChatService) {}
  async handleConnection(client: AuthenticatedSocket) {
    // Solo log cuando hay problemas, no en conexiones normales
  }
  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      
      // Notificar a otros usuarios que este usuario se desconectó
      this.server.emit('user_disconnected', {
        userId: client.userId,
        userName: client.userName
      });
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuthenticate(
    @MessageBody() data: { userId: string; userName: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      client.userId = data.userId;
      client.userName = data.userName;      this.connectedUsers.set(data.userId, client);
      
      // Notificar al cliente que la autenticación fue exitosa
      client.emit('authenticated', { success: true });
      
      // Notificar a otros usuarios que este usuario se conectó
      client.broadcast.emit('user_connected', {
        userId: data.userId,
        userName: data.userName
      });
      
      return { success: true };    } catch (error) {
      client.emit('authenticated', { success: false, error: error.message });
      return { success: false, error: error.message };
    }
  }
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {      // Crear el mensaje en la base de datos
      const message = await this.chatService.createMessage(createMessageDto);
      
      // Enviar el mensaje a todos los usuarios conectados (incluyendo el remitente)
      this.server.emit('new_message', message);
      
      return { success: true, message };    } catch (error) {
      client.emit('message_error', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('get_messages')
  async handleGetMessages(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const messages = await this.chatService.getAllMessages();
      client.emit('messages_loaded', messages);
      return { success: true, messages };    } catch (error) {
      client.emit('messages_error', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('get_users')
  async handleGetUsers(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const users = await this.chatService.getOnlineUsers();
      client.emit('users_loaded', users);
      return { success: true, users };    } catch (error) {
      client.emit('users_error', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (client.userId) {
      // Enviar a todos los otros usuarios que este usuario está escribiendo
      client.broadcast.emit('user_typing', {
        userId: client.userId,
        userName: client.userName,
        isTyping: data.isTyping
      });
    }
  }
}
