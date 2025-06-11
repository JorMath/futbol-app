import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../../config/supabase.config';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './interfaces/team.interface';

@Injectable()
export class TeamsService {

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const { name } = createTeamDto;

      // Verificar si ya existe un equipo con ese nombre
      const { data: existingTeam } = await supabase
        .from('team')
        .select('name')
        .eq('name', name)
        .single();

      if (existingTeam) {
        throw new BadRequestException('Ya existe un equipo con ese nombre');
      }

      const { data, error } = await supabase
        .from('team')
        .insert([{ name }])
        .select()
        .single();

      if (error) {
        throw new BadRequestException('Error al crear el equipo');
      }

      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al crear el equipo');
    }
  }

  async findAll(): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('team')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new BadRequestException('Error al obtener los equipos');
      }

      return data || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al obtener los equipos');
    }
  }

  async findOne(id: number): Promise<Team> {
    try {
      const { data, error } = await supabase
        .from('team')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Equipo no encontrado');
        }
        throw new BadRequestException('Error al obtener el equipo');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al obtener el equipo');
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    try {
      const { name } = updateTeamDto;

      // Verificar si el equipo existe
      await this.findOne(id);

      // Si se está actualizando el nombre, verificar que no exista otro equipo con ese nombre
      if (name) {
        const { data: existingTeam } = await supabase
          .from('team')
          .select('id, name')
          .eq('name', name)
          .neq('id', id)
          .single();

        if (existingTeam) {
          throw new BadRequestException('Ya existe otro equipo con ese nombre');
        }
      }

      const { data, error } = await supabase
        .from('team')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new BadRequestException('Error al actualizar el equipo');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al actualizar el equipo');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      // Verificar si el equipo existe
      await this.findOne(id);

      const { error } = await supabase
        .from('team')
        .delete()
        .eq('id', id);

      if (error) {
        throw new BadRequestException('Error al eliminar el equipo');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error inesperado al eliminar el equipo');
    }
  }
}
