import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    UserModule,FileModule
  ],
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
