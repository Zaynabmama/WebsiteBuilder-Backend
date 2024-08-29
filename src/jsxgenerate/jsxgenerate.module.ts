import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { JSXGeneratorService } from './jsxgenerate.service';

@Module({
  imports: [FileModule],
  providers: [JSXGeneratorService],
  exports: [JSXGeneratorService],
})
export class JSXGeneratorModule {}
