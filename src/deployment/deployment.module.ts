import { Module } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  providers: [DeploymentService],
  controllers: [DeploymentController]
})
export class DeploymentModule {}
