import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class SpaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { url } = req;
    
    // Si la ruta es una API o WebSocket, continuar con el siguiente middleware
    if (url.startsWith('/api') || url.startsWith('/socket.io')) {
      return next();
    }
    
    // Si es un archivo estático que existe (css, js, etc), continuar
    if (url.includes('.')) {
      const filePath = join(__dirname, '..', '..', 'public', url);
      if (existsSync(filePath)) {
        return next();
      }
    }
    
    // Para todas las demás rutas (rutas SPA), servir el index.html
    const indexPath = join(__dirname, '..', '..', 'public', 'index.html');
    if (existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    
    next();
  }
}
