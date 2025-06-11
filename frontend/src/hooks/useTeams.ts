import { useState, useEffect } from 'react';
import { Team } from '../types/team';
import { getTeams, createTeam, updateTeam, deleteTeam, CreateTeamData, UpdateTeamData } from '../api/teams';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await getTeams();
      setTeams(teamsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async (teamData: CreateTeamData): Promise<Team> => {
    try {
      setError(null);
      const newTeam = await createTeam(teamData);
      setTeams(prev => [newTeam, ...prev]);
      return newTeam;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const editTeam = async (id: number, teamData: UpdateTeamData): Promise<Team> => {
    try {
      setError(null);
      const updatedTeam = await updateTeam(id, teamData);
      setTeams(prev => prev.map(team => team.id === id ? updatedTeam : team));
      return updatedTeam;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeTeam = async (id: number): Promise<void> => {
    try {
      setError(null);
      await deleteTeam(id);
      setTeams(prev => prev.filter(team => team.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    refreshTeams: fetchTeams,
    addTeam,
    editTeam,
    removeTeam,
  };
};