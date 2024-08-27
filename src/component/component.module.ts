import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';

@Module({
  providers: [ComponentService]
})
export class ComponentModule {}
