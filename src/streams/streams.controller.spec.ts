import { Test, TestingModule } from '@nestjs/testing';
import { StreamsController } from './streams.controller.js';
import { StreamsService } from './streams.service.js';

describe('StreamsController', () => {
  let controller: StreamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamsController],
      providers: [StreamsService],
    }).compile();

    controller = module.get<StreamsController>(StreamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
