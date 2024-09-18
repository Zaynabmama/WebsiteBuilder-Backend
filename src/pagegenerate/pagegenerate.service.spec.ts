import { Test, TestingModule } from '@nestjs/testing';
import { PageGeneratorService } from './pagegenerate.service';

describe('PagegenerateService', () => {
  let service: PageGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageGeneratorService],
    }).compile();

    service = module.get<PageGeneratorService>(PageGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
