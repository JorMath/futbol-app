import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  team_id?: string;
}
