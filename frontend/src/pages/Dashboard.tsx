
import { useAuth } from '../context/AuthContext';
import { FeatureButton } from '../components/FeatureButton';
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
      <header className="dashboard-header">        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <i className="fas fa-futbol"></i>
            </div>
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
          <p>Has iniciado sesión exitosamente como: <strong>{user?.email}</strong></p>          <div className="features-grid">
            <FeatureButton
              icon={<><i className="fas fa-users"></i></>}
              title="Equipos"
              description="Gestiona y crea equipos de fútbol"
              to="/equipos"
            />
            <FeatureButton
              icon={<><i className="fas fa-running"></i></>}
              title="Jugadores"
              description="Administra información de jugadores"
              to="/jugadores"
            />
            <FeatureButton
              icon={<><i className="fas fa-comments"></i></>}
              title="Chat"
              description="Chatea con otros usuarios del sistema"
              to="/chat"
            />
          </div>
        </div>
      </main>
    </div>
  );
};
