import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  
  getServiceStatus() {
    return {
      gateway: 'running',
      services: {
        auth: 'http://localhost:3001',
        'teams-players': 'http://localhost:3002',
        chat: 'http://localhost:3003',
      },
      timestamp: new Date().toISOString(),
    };
  }

  getRoutes() {
    return {
      routes: [
        { path: '/api/auth/*', target: 'Auth Service' },
        { path: '/api/teams/*', target: 'Teams & Players Service' },
        { path: '/api/players/*', target: 'Teams & Players Service' },
        { path: '/api/chat/*', target: 'Chat Service' },
      ],
    };
  }
}
