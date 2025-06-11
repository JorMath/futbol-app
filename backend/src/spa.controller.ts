import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('')  // Sin prefijo para que no herede el prefijo global /api
export class SpaController {
  
  // Rutas específicas del frontend
  @Get(['dashboard', 'teams', 'players', 'chat', 'login', 'reset-password'])
  serveSpaRoutes(@Res() res: Response) {
    const indexPath = join(__dirname, '..', '..', 'public', 'index.html');
    return res.sendFile(indexPath);
  }
}
