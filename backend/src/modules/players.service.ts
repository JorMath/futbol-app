import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from '../modules/dto/create-player.dto';
import { UpdatePlayerDto } from '../modules/dto/update-player.dto';
import { Player } from './interfaces/player.interface';
import { supabase } from '../config/supabase.config';

@Injectable()
export class PlayersService {
  private supabase = supabase;

  async findAll(): Promise<Player[]> {
    const { data, error } = await this.supabase.from('player').select('*');
    if (error) throw error;
    return data;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // Convert team_id to string if it's a number
    const dto = { ...createPlayerDto };
    if (dto.team_id !== undefined && dto.team_id !== null) {
      dto.team_id = String(dto.team_id);
    }
    const { data, error } = await this.supabase
      .from('player')
      .insert([dto])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    // Convert team_id to string if it's a number
    const dto = { ...updatePlayerDto };
    if (dto.team_id !== undefined && dto.team_id !== null) {
      dto.team_id = String(dto.team_id);
    }
    const { data, error } = await this.supabase
      .from('player')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('player')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
