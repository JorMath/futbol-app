import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FeatureButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

export const FeatureButton: React.FC<FeatureButtonProps> = ({ icon, title, description, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button className="feature-card" onClick={handleClick} type="button">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
};
