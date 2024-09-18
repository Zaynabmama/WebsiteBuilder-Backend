import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';

import { JSXGeneratorModule } from 'src/jsxgenerate/jsxgenerate.module';




@Module({
  imports:[
    UserModule ,
    FileModule,
    JSXGeneratorModule
    //ComponentModule,
  ],
  providers: [PageService],
  controllers: [PageController]
})
export class PageModule {}
