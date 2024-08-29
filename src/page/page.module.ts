import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { ComponentModule } from 'src/component/component.module';




@Module({
  imports:[
    UserModule ,
    FileModule,
    //ComponentModule,
  ],
  providers: [PageService],
  controllers: [PageController]
})
export class PageModule {}
