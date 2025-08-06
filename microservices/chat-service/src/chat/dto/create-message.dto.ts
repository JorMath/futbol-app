import { IsString, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  sender_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
