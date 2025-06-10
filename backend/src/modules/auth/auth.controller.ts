// src/auth/auth.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  HttpException, 
  HttpStatus, 
  Logger, 
  Get, 
  Param,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() registerDto: RegisterDto) {
    try {
      this.logger.log(`Registration attempt for email: ${registerDto.email}`);
      const result = await this.authService.register(registerDto);
      return result;
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Mapear errores específicos
      if (error.message.includes('already registered') || error.message.includes('ya está registrado')) {
        throw new HttpException(
          'Este email ya está registrado',
          HttpStatus.CONFLICT
        );
      }
      
      throw new HttpException(
        error.message || 'Error al registrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('signin')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async signIn(@Body() loginDto: LoginDto) {
    try {
      this.logger.log(`Sign in attempt for email: ${loginDto.email}`);
      const result = await this.authService.signIn(loginDto);
      return result;
    } catch (error) {
      this.logger.error(`Sign in failed: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Email o contraseña incorrectos',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.authService.getUserById(id);
      return { success: true, user };
    } catch (error) {
      this.logger.error(`Get user failed: ${error.message}`, error.stack);
      
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get('health')
  health() {
    return { 
      status: 'ok', 
      message: 'Auth service is running',
      timestamp: new Date().toISOString()
    };
  }
}
