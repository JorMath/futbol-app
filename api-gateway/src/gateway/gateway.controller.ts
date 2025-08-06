import {
  Controller,
  All,
  Req,
  Res,
  Param,
  Body,
  Query,
  Headers,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(private readonly proxyService: ProxyService) {}

  // Auth Service Routes
  @All('auth/*')
  async proxyToAuth(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying auth request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('auth', req, res, body, query, headers);
  }

  @All('auth')
  async proxyToAuthRoot(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying auth root request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('auth', req, res, body, query, headers);
  }

  // Teams & Players Service Routes
  @All('teams/*')
  async proxyToTeams(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying teams request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('teams-players', req, res, body, query, headers);
  }

  @All('teams')
  async proxyToTeamsRoot(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying teams root request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('teams-players', req, res, body, query, headers);
  }

  @All('players/*')
  async proxyToPlayers(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying players request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('teams-players', req, res, body, query, headers);
  }

  @All('players')
  async proxyToPlayersRoot(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying players root request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('teams-players', req, res, body, query, headers);
  }

  // Chat Service Routes
  @All('chat/*')
  async proxyToChat(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying chat request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('chat', req, res, body, query, headers);
  }

  @All('chat')
  async proxyChatRoot(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    this.logger.log(`Proxying chat root request: ${req.method} ${req.url}`);
    return this.proxyService.proxy('chat', req, res, body, query, headers);
  }

  // Health check for specific services
  @All('health/:service')
  async checkServiceHealth(@Param('service') service: string) {
    return this.proxyService.checkHealth(service);
  }
}
