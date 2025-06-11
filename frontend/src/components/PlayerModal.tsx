import React, { useState, useEffect } from 'react';
import { playersApi, type Player, type CreatePlayerData, type UpdatePlayerData } from '../api/players';
import type { Team } from '../types/team';
import './PlayerModal.css';

interface PlayerModalProps {
  player?: Player | null;
  teams: Team[];
  onSave: (player: Player) => void;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  teams,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    team_id: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        team_id: player.team_id ? String(player.team_id) : ''
      });
    } else {
      setFormData({
        name: '',
        team_id: ''
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [player]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      setSubmitError(null);
      // Buscar el id del equipo seleccionado (por nombre)
      let selectedTeamId: number | null = null;
      if (formData.team_id) {
        const selectedTeam = teams.find(t => String(t.id) === formData.team_id || t.name === formData.team_id);
        selectedTeamId = selectedTeam ? selectedTeam.id : null;
      }
      const playerData: CreatePlayerData | UpdatePlayerData = {
        name: formData.name.trim(),
        team_id: selectedTeamId
      };
      let response;
      if (player) {
        response = await playersApi.updatePlayer(player.id, playerData);
      } else {
        response = await playersApi.createPlayer(playerData as CreatePlayerData);
      }
      if (response) {
        onSave(response);
      }
    } catch (error: any) {
      console.error('Error saving player:', error);
      setSubmitError(error.message || 'Error al guardar el jugador');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-content player-modal">
        <div className="modal-header">
          <h2>{player ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}</h2>
          <button 
            type="button" 
            className="modal-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="player-form">
          <div className="form-body">
            {submitError && (
              <div className="error-banner">
                {submitError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nombre del Jugador *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ej. Lionel Messi"
                disabled={loading}
                maxLength={100}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="team_id" className="form-label">
                Equipo
              </label>
              <select
                id="team_id"
                name="team_id"
                value={formData.team_id}
                onChange={handleInputChange}
                className="form-select"
                disabled={loading}
              >
                <option value="">Sin equipo asignado</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? 'Guardando...' : (player ? 'Actualizar Jugador' : 'Crear Jugador')}
            </button>
          </div>        </form>
      </div>
    </div>
  );
};

export default PlayerModal;
