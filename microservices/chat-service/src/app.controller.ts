import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'chat-service',
      port: process.env.PORT || 3003,
      websocket: 'enabled',
      timestamp: new Date().toISOString(),
    };
  }
}
