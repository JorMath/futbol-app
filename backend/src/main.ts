import { config } from 'dotenv';
config(); // Cargar variables de entorno al inicio

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar prefijo global para las APIs
  app.setGlobalPrefix('api');
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validateCustomDecorators: true,
  }));
    // Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // URLs del monolito
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const port = 3000; // Puerto fijo para el monolito
  await app.listen(port);
}
bootstrap();
