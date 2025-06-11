import React, { useEffect, useState } from 'react';
import { playersApi, type Player } from '../api/players';
import { getTeams } from '../api/teams';
import type { Team } from '../types/team';
import PlayerModal from '../components/PlayerModal';
import './TeamsPage.css';

export const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playersApi.getPlayers();
      setPlayers(data);
    } catch (err) {
      setError('Error al cargar jugadores');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch {
      setTeams([]);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const handleAdd = () => {
    setSelectedPlayer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleDelete = async (player: Player) => {
    if (window.confirm(`¿Eliminar jugador "${player.name}"?`)) {
      try {
        await playersApi.deletePlayer(player.id);
        fetchPlayers();
      } catch {
        setError('Error al eliminar jugador');
      }
    }
  };

  const handleSave = (player: Player) => {
    setIsModalOpen(false);
    fetchPlayers();
  };

  return (
    <div className="teams-page">
      <div className="teams-header">
        <h1>Jugadores</h1>
        <button className="btn-primary" onClick={handleAdd}>
          + Nuevo Jugador
        </button>
      </div>
      {error && <div className="error-banner"><p>{error}</p></div>}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando jugadores...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="empty-state">
          <h3>No hay jugadores registrados</h3>
          <button className="btn-primary" onClick={handleAdd}>
            Crear Primer Jugador
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {players.map((player) => (
            <div key={player.id} className="team-card">
              <div className="team-info">
                <h3>{player.name}</h3>
                <p className="team-date">
                  Equipo: {teams.find(t => t.id === player.team_id)?.name || 'Sin equipo'}
                </p>
                <p className="team-date">
                  Creado: {player.created_at ? new Date(player.created_at).toLocaleString() : '-'}
                </p>
              </div>
              <div className="team-actions">
                <button className="btn-edit" onClick={() => handleEdit(player)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(player)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && (
        <PlayerModal
          player={selectedPlayer}
          teams={teams}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PlayersPage;
