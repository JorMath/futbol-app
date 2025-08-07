import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly websocketConnectionsTotal: Counter<string>;
  private readonly activeWebsocketConnections: Gauge<string>;
  private readonly messagesTotal: Counter<string>;

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

    // Contador de conexiones WebSocket
    this.websocketConnectionsTotal = new Counter({
      name: 'websocket_connections_total',
      help: 'Total number of WebSocket connections',
      labelNames: ['event'],
    });

    // Gauge para conexiones WebSocket activas
    this.activeWebsocketConnections = new Gauge({
      name: 'active_websocket_connections',
      help: 'Number of active WebSocket connections',
    });

    // Contador de mensajes
    this.messagesTotal = new Counter({
      name: 'messages_total',
      help: 'Total number of messages sent',
      labelNames: ['room'],
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

  incrementWebsocketConnections(event: 'connected' | 'disconnected') {
    this.websocketConnectionsTotal.inc({ event });
    
    if (event === 'connected') {
      this.activeWebsocketConnections.inc();
    } else {
      this.activeWebsocketConnections.dec();
    }
  }

  incrementMessages(room: string) {
    this.messagesTotal.inc({ room });
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
