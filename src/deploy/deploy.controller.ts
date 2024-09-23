import { Controller, Post, Param, Body } from '@nestjs/common';
import { NetlifyDeployService } from './deploy.service';


@Controller('deploy')
export class NetlifyDeployController {
  constructor(private readonly netlifyDeployService: NetlifyDeployService) {}

  @Post(':userId/:projectName')
  async deploy(
    @Param('userId') userId: string,
    @Param('projectName') projectName: string,
  ): Promise<any> {
    try {
      const deploymentResult = await this.netlifyDeployService.deployProject(userId, projectName);
      return {
        message: 'Deployment successful',
        deployment: deploymentResult,
      };
    } catch (error) {
      return {
        message: 'Deployment failed',
        error: error.message,
      };
    }
  }
}
