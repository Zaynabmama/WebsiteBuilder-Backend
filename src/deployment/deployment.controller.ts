import { Controller, Get, Param } from '@nestjs/common';
import { DeploymentService } from './deployment.service';

@Controller('deployment')
export class DeploymentController {
    constructor(private readonly deploymentService: DeploymentService) {}
    @Get('test-create/:userId/:projectId')
  async testCreateSite(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<string> {
    return await this.deploymentService.createSiteForUser(userId, projectId);
  }

}
