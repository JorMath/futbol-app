import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Teams & Players Service - Futbol App Microservices';
  }
}
