import { Test, TestingModule } from '@nestjs/testing';
import { AdminJsController } from './admin-js.controller.js';

describe('AdminJsController', () => {
  let controller: AdminJsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminJsController],
    }).compile();

    controller = module.get<AdminJsController>(AdminJsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
