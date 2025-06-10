import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return <LoginForm onToggleForm={toggleForm} isSignUp={isSignUp} />;
};
