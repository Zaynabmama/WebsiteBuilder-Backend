import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { JSXGeneratorModule } from 'src/jsxgenerate/jsxgenerate.module';

@Module({
  imports:[UserModule,FileModule,JSXGeneratorModule],
  providers: [ComponentService],
  controllers: [ComponentController],
  exports:[ComponentModule]
})
export class ComponentModule {}
