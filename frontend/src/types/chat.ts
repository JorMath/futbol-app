export interface Message {
  id: number;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateMessageData {
  sender_id: string;
  content: string;
}

export interface TypingData {
  userId: string;
  userName: string;
  isTyping: boolean;
}
