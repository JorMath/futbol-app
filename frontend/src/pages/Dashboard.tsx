import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">⚽</div>
            <h1>Futbol App</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              <button onClick={handleSignOut} className="sign-out-button">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>¡Bienvenido a Futbol App!</h2>
          <p>Has iniciado sesión exitosamente como: <strong>{user?.email}</strong></p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Equipos</h3>
              <p>Gestiona y crea equipos de fútbol</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏃‍♂️</div>
              <h3>Jugadores</h3>
              <p>Administra información de jugadores</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
