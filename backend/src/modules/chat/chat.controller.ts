import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.createMessage(createMessageDto);
  }

  @Get('messages')
  async getAllMessages() {
    return this.chatService.getAllMessages();
  }

  @Get('users')
  async getAllUsers() {
    return this.chatService.getOnlineUsers();
  }
}
