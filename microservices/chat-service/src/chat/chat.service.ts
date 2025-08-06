import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './interfaces/message.interface';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const { sender_id, content } = createMessageDto;
      
      this.logger.log(`Creating general chat message from ${sender_id}`);      const { data, error } = await supabase
        .from('messages')
        .insert([{ 
          sender_id, 
          content 
        }])
        .select('*')
        .single();

      if (error) {
        this.logger.error(`Error creating message: ${error.message}`, error);
        throw new BadRequestException('Error al enviar el mensaje');
      }      // Formatear la respuesta para incluir el nombre del sender
      // Necesitamos obtener el nombre del usuario por separado
      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', sender_id)
        .single();

      const formattedMessage: Message = {
        ...data,
        sender_name: userData?.name || 'Usuario desconocido',
      };

      this.logger.log(`Message created successfully with ID: ${data.id}`);
      return formattedMessage;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error creating message: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al enviar el mensaje');
    }
  }

  async getAllMessages(): Promise<Message[]> {
    try {
      this.logger.log('Fetching all general chat messages');      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100); // Limitar a los últimos 100 mensajes

      if (error) {
        this.logger.error(`Error fetching messages: ${error.message}`, error);
        throw new BadRequestException('Error al obtener los mensajes');
      }      // Formatear los mensajes para incluir los nombres
      // Necesitamos obtener los nombres de los usuarios por separado
      const userIds = [...new Set((data || []).map(msg => msg.sender_id))];
      const { data: usersData } = await supabase
        .from('users')
        .select('id, name')
        .in('id', userIds);

      const usersMap = new Map();
      (usersData || []).forEach(user => {
        usersMap.set(user.id, user.name);
      });

      const formattedMessages: Message[] = (data || []).map(message => ({
        ...message,
        sender_name: usersMap.get(message.sender_id) || 'Usuario desconocido',
      }));      if (formattedMessages.length > 0) {
        this.logger.log(`Found ${formattedMessages.length} messages`);
      }
      return formattedMessages;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error fetching messages: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al obtener los mensajes');
    }
  }

  async getOnlineUsers(): Promise<any[]> {
    try {
      this.logger.log('Fetching all users for chat');

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .order('name', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching users: ${error.message}`, error);
        throw new BadRequestException('Error al obtener los usuarios');
      }      if (data?.length > 0) {
        this.logger.log(`Found ${data.length} users`);
      }
      return data || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error fetching users: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al obtener los usuarios');
    }
  }
}
