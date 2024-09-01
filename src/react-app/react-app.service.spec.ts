import { Test, TestingModule } from '@nestjs/testing';
import { ReactAppService } from './react-app.service';

describe('ReactAppService', () => {
  let service: ReactAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactAppService],
    }).compile();

    service = module.get<ReactAppService>(ReactAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
