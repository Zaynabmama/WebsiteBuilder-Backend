import { Module } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { UserModule } from 'src/user/user.module';
import { PagegenerateModule } from 'src/pagegenerate/pagegenerate.module';

@Module({
  imports:[UserModule,PagegenerateModule],
  providers: [DeploymentService],
  controllers: [DeploymentController]
})
export class DeploymentModule {}
