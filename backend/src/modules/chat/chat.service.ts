import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../../config/supabase.config';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './interfaces/message.interface';

@Injectable()
export class ChatService {

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const { sender_id, content } = createMessageDto;

      const { data, error } = await supabase
        .from('messages')
        .insert([{ 
          sender_id, 
          content 
        }])
        .select('*')
        .single();

      if (error) {
        throw new BadRequestException('Error al enviar el mensaje');
      }

      // Formatear la respuesta para incluir el nombre del sender
      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', sender_id)
        .single();

      const formattedMessage: Message = {
        ...data,
        sender_name: userData?.name || 'Usuario desconocido',
      };

      return formattedMessage;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al enviar el mensaje');
    }
  }

  async getAllMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        throw new BadRequestException('Error al obtener los mensajes');
      }

      // Formatear los mensajes para incluir los nombres
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
      }));

      return formattedMessages;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al obtener los mensajes');
    }
  }

  async getOnlineUsers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .order('name', { ascending: true });

      if (error) {
        throw new BadRequestException('Error al obtener los usuarios');
      }

      return data || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al obtener los usuarios');
    }
  }
}
