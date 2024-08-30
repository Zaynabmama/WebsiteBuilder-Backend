import { Controller, Post, Param, Get } from '@nestjs/common';
import { DeploymentService } from './deployment.service';

@Controller('deployment')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  // Endpoint to create a new site on Netlify
  @Post('create-site/:userId/:projectId')
  async createSite(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<string> {
    return await this.deploymentService.createSiteForUser(userId, projectId);
  }

  // Endpoint to deploy the project (generate HTML, transpile JSX, deploy)
  @Post('deploy/:userId/:projectId/:projectName')
  async deployProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('projectName') projectName: string,
  ): Promise<void> {
    await this.deploymentService.deployProject(userId, projectId, projectName);
  }

  // Endpoint to manually trigger a redeployment on Netlify
  @Post('redeploy/:userId/:projectId')
  async redeploySite(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<void> {
    await this.deploymentService.redeploySite(userId, projectId);
  }

  // Endpoint to check the deployment status on Netlify
  @Get('status/:siteId')
  async checkDeploymentStatus(
    @Param('siteId') siteId: string,
  ): Promise<any> {
    return await this.deploymentService.checkDeploymentStatus(siteId);
  }

  // Endpoint to retrieve JSX files for a given project
  @Get('jsx-files/:userId/:projectId')
  async getJsxFiles(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<string[]> {
    return await this.deploymentService.getJsxFilesForProject(userId, projectId);
  }
}
