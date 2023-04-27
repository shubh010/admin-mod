import { Module } from '@nestjs/common';
import { WebsocketsService } from './websockets.service.js';
import { WebsocketsGateway } from './websockets.gateway.js';

@Module({
  providers: [WebsocketsGateway, WebsocketsService],
})
export class WebsocketsModule {}
