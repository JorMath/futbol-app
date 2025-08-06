import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './interfaces/team.interface';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const { name } = createTeamDto;
      
      this.logger.log(`Creating team: ${name}`);

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
        this.logger.error(`Error creating team: ${error.message}`, error);
        throw new BadRequestException('Error al crear el equipo');
      }

      this.logger.log(`Team created successfully with ID: ${data.id}`);
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error creating team: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al crear el equipo');
    }
  }

  async findAll(): Promise<Team[]> {
    try {
      this.logger.log('Fetching all teams');

      const { data, error } = await supabase
        .from('team')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching teams: ${error.message}`, error);
        throw new BadRequestException('Error al obtener los equipos');
      }

      this.logger.log(`Found ${data?.length || 0} teams`);
      return data || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error fetching teams: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al obtener los equipos');
    }
  }

  async findOne(id: number): Promise<Team> {
    try {
      this.logger.log(`Fetching team with ID: ${id}`);

      const { data, error } = await supabase
        .from('team')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Equipo no encontrado');
        }
        this.logger.error(`Error fetching team: ${error.message}`, error);
        throw new BadRequestException('Error al obtener el equipo');
      }

      this.logger.log(`Team found: ${data.name}`);
      return data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error fetching team: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al obtener el equipo');
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    try {
      const { name } = updateTeamDto;
      
      this.logger.log(`Updating team with ID: ${id}`);

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
        this.logger.error(`Error updating team: ${error.message}`, error);
        throw new BadRequestException('Error al actualizar el equipo');
      }

      this.logger.log(`Team updated successfully: ${data.name}`);
      return data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error updating team: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al actualizar el equipo');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Deleting team with ID: ${id}`);

      // Verificar si el equipo existe
      await this.findOne(id);

      const { error } = await supabase
        .from('team')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting team: ${error.message}`, error);
        throw new BadRequestException('Error al eliminar el equipo');
      }

      this.logger.log(`Team deleted successfully with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error deleting team: ${error.message}`, error);
      throw new BadRequestException('Error inesperado al eliminar el equipo');
    }
  }
}
