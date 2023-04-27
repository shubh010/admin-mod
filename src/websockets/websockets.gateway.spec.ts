import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketsGateway } from './websockets.gateway.js';
import { WebsocketsService } from './websockets.service.js';

describe('WebsocketsGateway', () => {
  let gateway: WebsocketsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketsGateway, WebsocketsService],
    }).compile();

    gateway = module.get<WebsocketsGateway>(WebsocketsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
