import { Test, TestingModule } from '@nestjs/testing';
import { JsxgenerateService } from './jsxgenerate.service';

describe('JsxgenerateService', () => {
  let service: JsxgenerateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsxgenerateService],
    }).compile();

    service = module.get<JsxgenerateService>(JsxgenerateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
