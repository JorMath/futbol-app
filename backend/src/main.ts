import { config } from 'dotenv';
config(); // Cargar variables de entorno al inicio

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validateCustomDecorators: true,
  }));
  
  // Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // URLs del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`Backend running on http://localhost:${port}`);
  logger.log(`Health check: http://localhost:${port}/auth/health`);
}
bootstrap();
