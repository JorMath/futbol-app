import { Team } from '../types/team';

const API_BASE_URL = 'http://localhost:3000';

export interface CreateTeamData {
  name: string;
}

export interface UpdateTeamData {
  name?: string;
}

// GET /teams - Obtener todos los equipos
export const getTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los equipos');
  }

  return response.json();
};

// GET /teams/:id - Obtener un equipo por ID
export const getTeam = async (id: number): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el equipo');
  }

  return response.json();
};

// POST /teams - Crear un nuevo equipo
export const createTeam = async (teamData: CreateTeamData): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al crear el equipo');
  }

  return response.json();
};

// PATCH /teams/:id - Actualizar un equipo
export const updateTeam = async (id: number, teamData: UpdateTeamData): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al actualizar el equipo');
  }

  return response.json();
};

// DELETE /teams/:id - Eliminar un equipo
export const deleteTeam = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al eliminar el equipo');
  }
};