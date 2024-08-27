import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  providers: [ComponentService],
  controllers: [ComponentController]
})
export class ComponentModule {}
