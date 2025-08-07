import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly dbOperationsTotal: Counter<string>;

  constructor() {
    // Habilitar métricas por defecto del sistema
    collectDefaultMetrics();

    // Contador de requests HTTP totales
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    // Histograma de duración de requests HTTP
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    // Contador específico para operaciones de base de datos
    this.dbOperationsTotal = new Counter({
      name: 'db_operations_total',
      help: 'Total number of database operations',
      labelNames: ['operation', 'table', 'status'],
    });
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  observeHttpDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe(
      {
        method,
        route,
      },
      duration,
    );
  }

  incrementDbOperations(operation: string, table: string, status: 'success' | 'error') {
    this.dbOperationsTotal.inc({ operation, table, status });
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
