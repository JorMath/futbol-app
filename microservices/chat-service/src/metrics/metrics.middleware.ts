import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.path;
      
      this.metricsService.incrementHttpRequests(
        req.method,
        route,
        res.statusCode,
      );
      
      this.metricsService.observeHttpDuration(
        req.method,
        route,
        duration,
      );
    });

    next();
  }
}
