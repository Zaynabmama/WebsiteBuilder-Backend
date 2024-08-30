import { Module } from '@nestjs/common';
import { PageGeneratorService } from './pagegenerate.service';
import { PageGeneratorController } from './pagegenerate.controller';

@Module({
  providers: [PageGeneratorService],
  controllers: [PageGeneratorController],
  exports:[PageGeneratorService]
})
export class PagegenerateModule {}
