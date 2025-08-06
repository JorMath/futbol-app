import type { Player } from '../types/player'; // Ensure correct relative path

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface CreatePlayerData {
  name: string;
  team_id?: number | null;
}

export interface UpdatePlayerData {
  name?: string;
  team_id?: number | null;
}

// GET /players - Obtener todos los jugadores
export const getPlayers = async (): Promise<Player[]> => {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los jugadores');
  }

  return response.json();
};

// GET /players/:id - Obtener un jugador por ID
export const getPlayer = async (id: number): Promise<Player> => {
  const response = await fetch(`${API_BASE_URL}/players/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el jugador');
  }

  return response.json();
};

// POST /players - Crear un nuevo jugador
export const createPlayer = async (playerData: CreatePlayerData): Promise<Player> => {
  // Forzar team_id a string si existe
  const dataToSend = {
    ...playerData,
    team_id: playerData.team_id !== undefined && playerData.team_id !== null ? String(playerData.team_id) : null,
  };
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al crear el jugador');
  }

  return response.json();
};

// PATCH /players/:id - Actualizar un jugador
export const updatePlayer = async (id: number, playerData: UpdatePlayerData): Promise<Player> => {
  // Forzar team_id a string si existe
  const dataToSend = {
    ...playerData,
    team_id: playerData.team_id !== undefined && playerData.team_id !== null ? String(playerData.team_id) : null,
  };
  const response = await fetch(`${API_BASE_URL}/players/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al actualizar el jugador');
  }

  return response.json();
};

// DELETE /players/:id - Eliminar un jugador
export const deletePlayer = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/players/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al eliminar el jugador');
  }
};

export type { Player };

export const playersApi = {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
