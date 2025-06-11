import React, { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { TeamModal } from '../components/TeamModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { TeamCard } from '../components/TeamCard';
import type { Team } from '../types/team';
import './TeamsPage.css';

export const TeamsPage: React.FC = () => {
  const { teams, loading, error, addTeam, editTeam, removeTeam } = useTeams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleCreateTeam = async (name: string) => {
    await addTeam({ name });
  };

  const handleEditTeam = async (name: string) => {
    if (selectedTeam) {
      await editTeam(selectedTeam.id, { name });
      setSelectedTeam(null);
    }
  };

  const handleDeleteTeam = async () => {
    if (selectedTeam) {
      await removeTeam(selectedTeam.id);
      setSelectedTeam(null);
    }
  };

  const openEditModal = (team: Team) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="teams-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="teams-header">
        <h1>Equipos</h1>
        <button 
          className="btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Nuevo Equipo
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <div className="teams-content">
        {teams.length === 0 ? (
          <div className="empty-state">
            <h3>No hay equipos registrados</h3>
            <p>Comienza creando tu primer equipo</p>
            <button 
              className="btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Crear Primer Equipo
            </button>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <TeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
        title="Crear Nuevo Equipo"
      />

      <TeamModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTeam(null);
        }}
        onSubmit={handleEditTeam}
        team={selectedTeam}
        title="Editar Equipo"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTeam(null);
        }}
        onConfirm={handleDeleteTeam}
        title="Eliminar Equipo"
        message={`¿Estás seguro de que deseas eliminar el equipo "${selectedTeam?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};