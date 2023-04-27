import { Test, TestingModule } from '@nestjs/testing';
import { AdminJsService } from './admin-js.service.js';

describe('AdminJsService', () => {
  let service: AdminJsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminJsService],
    }).compile();

    service = module.get<AdminJsService>(AdminJsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
