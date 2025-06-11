export interface Message {
  id: number;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}
