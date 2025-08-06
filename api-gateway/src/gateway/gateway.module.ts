import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ProxyService } from './proxy.service';

@Module({
  imports: [],
  controllers: [GatewayController],
  providers: [GatewayService, ProxyService],
})
export class GatewayModule {}
