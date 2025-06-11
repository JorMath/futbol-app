import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  team_id?: string;
}
