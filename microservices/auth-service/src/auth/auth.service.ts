// src/auth/auth.service.ts
import { Injectable, Logger, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, name } = registerDto;
      
      this.logger.log(`Attempting to register user with email: ${email}`);
        // Verificar si el usuario ya existe en la tabla users (más eficiente)
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        throw new ConflictException('Este email ya está registrado');
      }

      // Crear usuario usando signUp (esto activará el trigger automáticamente)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      });

      if (authError) {
        this.logger.error(`Registration error: ${authError.message}`, authError);
        
        if (authError.message.includes('already registered')) {
          throw new ConflictException('Este email ya está registrado');
        }
        
        if (authError.message.includes('Invalid email')) {
          throw new BadRequestException('Email inválido');
        }
        
        if (authError.message.includes('Password')) {
          throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
        }
        
        throw new BadRequestException(`Error de registro: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      this.logger.log(`User created in auth.users: ${authData.user.id}`);

      // Esperar un momento para que el trigger se ejecute
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verificar que el trigger creó el registro en public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        this.logger.error(`Error fetching user data: ${userError.message}`, userError);
        
        // Si el trigger no funcionó (error PGRST116 = no rows found), crear manualmente
        if (userError.code === 'PGRST116') {
          this.logger.warn('Trigger did not create user record, creating manually...');
          
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              name: name || '',
              created_at: new Date().toISOString()
            });
          
          if (insertError) {
            this.logger.error(`Error inserting user manually: ${insertError.message}`, insertError);
            throw new Error('Error al crear el perfil del usuario');
          }
        }
      } else {
        this.logger.log(`User profile created successfully by trigger: ${userData.id}`);
      }
      
      return { 
        success: true, 
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: name || '',
          emailConfirmed: !!authData.user.email_confirmed_at
        },
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error during registration: ${error.message}`, error.stack);
      
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  async signIn(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      
      this.logger.log(`Attempting to sign in user with email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.logger.error(`Sign in error: ${error.message}`, error);
        throw new UnauthorizedException('Email o contraseña incorrectos');
      }

      if (!data.user) {
        throw new UnauthorizedException('Email o contraseña incorrectos');
      }

      // Obtener datos del usuario de la tabla public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        this.logger.error(`Error fetching user data: ${userError.message}`, userError);
      }

      this.logger.log(`User signed in successfully: ${data.user.id}`);
      
      return { 
        success: true, 
        user: userData || {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || ''
        },
        session: data.session,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      this.logger.error(`Unexpected error during sign in: ${error.message}`, error.stack);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Error de autenticación');
    }
  }

  async getUserById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(`Error fetching user: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`Error getting user by ID: ${error.message}`, error.stack);
      throw error;
    }
  }
}
