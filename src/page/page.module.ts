import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
  ],
  providers: [PageService],
  controllers: [PageController]
})
export class PageModule {}
