import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly serviceUrls: Record<string, string>;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.serviceUrls = {
      auth: this.configService.get<string>('AUTH_SERVICE_URL'),
      'teams-players': this.configService.get<string>('TEAMS_PLAYERS_SERVICE_URL'),
      chat: this.configService.get<string>('CHAT_SERVICE_URL'),
    };
  }

  async proxy(
    service: string,
    req: Request,
    res: Response,
    body: any,
    query: any,
    headers: any,
  ) {
    try {
      const serviceUrl = this.serviceUrls[service];
      if (!serviceUrl) {
        throw new HttpException(
          `Service ${service} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Remove the API prefix from the path and handle service-specific routing
      const originalPath = req.url;
      let servicePath = '';
      
      if (originalPath.startsWith('/api/teams')) {
        servicePath = originalPath.replace('/api/teams', '/teams');
      } else if (originalPath.startsWith('/api/players')) {
        servicePath = originalPath.replace('/api/players', '/players');
      } else if (originalPath.startsWith('/api/auth')) {
        servicePath = originalPath.replace('/api/auth', '/auth');
      } else if (originalPath.startsWith('/api/chat')) {
        servicePath = originalPath.replace('/api/chat', '/chat');
      } else {
        // Fallback for other routes
        servicePath = originalPath.replace(/^\/api\/[^\/]+/, '');
      }
      
      const targetUrl = `${serviceUrl}${servicePath}`;

      this.logger.log(`Proxying to: ${targetUrl}`);

      // Forward the request
      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: body,
        params: query,
        headers: {
          ...headers,
          host: undefined, // Remove host header
        },
        timeout: 30000,
      });

      // Forward the response
      res.status(response.status);
      Object.keys(response.headers).forEach((key) => {
        res.setHeader(key, response.headers[key]);
      });
      res.json(response.data);

    } catch (error) {
      this.logger.error(`Proxy error for ${service}:`, error.message);
      
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Service unavailable',
          service,
          error: error.message,
        });
      }
    }
  }

  async checkHealth(service: string) {
    try {
      const serviceUrl = this.serviceUrls[service];
      if (!serviceUrl) {
        return { status: 'unknown', service };
      }

      const response = await axios.get(`${serviceUrl}/health`);

      return {
        status: 'healthy',
        service,
        response: response.data,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service,
        error: error.message,
      };
    }
  }
}
