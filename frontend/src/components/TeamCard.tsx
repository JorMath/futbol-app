import React from 'react';
import type { Team } from '../types/team';
import './TeamCard.css';

interface TeamCardProps {
    team: Team;
    onEdit: (team: Team) => void;
    onDelete: (team: Team) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onEdit, onDelete }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="team-card">
            <div className="team-info">
                <h3>{team.name}</h3>
                <p className="team-date">
                    Creado: {formatDate(team.created_at)}
                </p>
            </div>
            <div className="team-actions">
                <button
                    className="btn-edit"
                    onClick={() => onEdit(team)}
                    title="Editar"
                >
                    <span role="img" aria-label="Editar">✏️</span>
                </button>
                <button
                    className="btn-delete"
                    onClick={() => onDelete(team)}
                    title="Eliminar"
                >
                    <span role="img" aria-label="Eliminar">🗑️</span>
                </button>
            </div>
        </div>
    );
};
