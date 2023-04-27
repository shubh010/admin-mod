import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketsService } from './websockets.service.js';
import { Logger } from '@nestjs/common';

@WebSocketGateway(5050)
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('MessageGateway');
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketsService: WebsocketsService) {}

  handleConnection(client: Socket, ...args: any[]) {
    const { modelName } = client.handshake.query;
    this.logger.log(
      `Client connected: ${client.id} & Subscribed to model ${modelName}`,
    );
    if (modelName != undefined)
      this.websocketsService.emitChange(modelName, this.server, client);
  }

  handleDisconnect(client: Socket) {
    const { modelName } = client.handshake.query;
    this.logger.log(`Client disconnected: ${client.id}`);
    if (modelName) {
      this.websocketsService.closeConnection(modelName, client);
    }
  }

  @SubscribeMessage('error')
  handleError(client: Socket, payload: any) {
    this.logger.error(`Error from client ${client.id}: ${payload}`);
  }

  afterInit() {
    this.logger.log('Initialized Socket');
  }
}
