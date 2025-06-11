import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        
        // Mapear errores específicos a mensajes más amigables
        if (error.message.includes('already registered')) {
          throw new Error('Este email ya está registrado');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Por favor ingresa un email válido');
        } else if (error.message.includes('Password')) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        
        throw new Error(error.message || 'Error al crear la cuenta');
      }
      
      if (!data.user) {
        throw new Error('No se pudo crear el usuario');
      }
      
      console.log('Usuario creado exitosamente:', data.user.id);
      
      // Si el email no está confirmado, mostrar mensaje
      if (!data.user.email_confirmed_at) {
        throw new Error('Por favor verifica tu email para activar tu cuenta');
      }
      
    } catch (error: any) {
      console.error('Error in signUp:', error);
      throw new Error(error.message || 'Error al crear la cuenta');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
