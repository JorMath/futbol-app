import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ChatService');
  
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:8000', 'http://localhost:8080', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);
  
  logger.log(`💬 Chat Service running on http://localhost:${port}`);
  logger.log(`📚 Health check: http://localhost:${port}/health`);
  logger.log(`🔌 WebSocket chat: http://localhost:${port}/chat`);
}

bootstrap();
