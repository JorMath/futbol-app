import React, { useEffect, useState } from 'react';
import { playersApi, type Player } from '../api/players';
import { getTeams } from '../api/teams';
import type { Team } from '../types/team';
import PlayerModal from '../components/PlayerModal';
import PlayerCard from '../components/PlayerCard';
import { ConfirmModal } from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import './TeamsPage.css';
import './Dashboard.css';

export const PlayersPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

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

  const handleDelete = (player: Player) => {
    setPlayerToDelete(player);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (playerToDelete) {
      try {
        await playersApi.deletePlayer(playerToDelete.id);
        setPlayerToDelete(null);
        setIsDeleteModalOpen(false);
        fetchPlayers();
      } catch {
        setError('Error al eliminar jugador');
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchPlayers();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <i className="fas fa-futbol"></i>
            </div>
            <h1>Futbol App</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              <button onClick={signOut} className="sign-out-button">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="welcome-card">
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
            <div className="features-grid">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  team={teams.find(t => t.id === player.team_id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
        {isModalOpen && (
          <PlayerModal
            player={selectedPlayer}
            teams={teams}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {isDeleteModalOpen && playerToDelete && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => { setIsDeleteModalOpen(false); setPlayerToDelete(null); }}
            onConfirm={confirmDelete}
            title="Eliminar jugador"
            message={`¿Estás seguro de que deseas eliminar a "${playerToDelete.name}"? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            cancelText="Cancelar"
          />
        )}
      </main>
    </div>
  );
};

export default PlayersPage;
