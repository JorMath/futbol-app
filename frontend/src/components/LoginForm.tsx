import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css';

interface LoginFormProps {
  onToggleForm: () => void;
  isSignUp: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, isSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        await signUp(email, password, name);
        // Si llega aquí, el registro fue exitoso
        alert('¡Registro exitoso! Por favor verifica tu email para activar tu cuenta.');
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Mapear errores comunes a mensajes más amigables
      let errorMessage = err.message || 'Ha ocurrido un error';
      
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Por favor verifica tu email antes de iniciar sesión';
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (errorMessage.includes('Database error saving new user')) {
        errorMessage = 'Error al crear la cuenta. Por favor intenta nuevamente.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo">⚽</div>
          </div>
          <h1 className="login-title">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h1>
          <p className="login-subtitle">
            {isSignUp 
              ? 'Únete a la mejor app de fútbol' 
              : 'Bienvenido de vuelta'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}          {isSignUp && (
            <div className="input-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {isSignUp && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button
              type="button"
              onClick={onToggleForm}
              className="toggle-button"
              disabled={loading}
            >
              {isSignUp ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
