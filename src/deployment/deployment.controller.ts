import { Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('deploy-static/:userId/:projectId')
  async deployStaticFiles(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<void> {
    await this.deploymentService.deployStaticFilesToNetlify(userId, projectId);
  }
}
