import { Controller, Post, Param, Body, Req } from '@nestjs/common';
import { NetlifyDeployService } from './deploy.service';


@Controller('deploy')
export class NetlifyDeployController {
  constructor(private readonly netlifyDeployService: NetlifyDeployService) {}

  @Post(':userId/:projectName')
  async deploy(
    @Req() req,
    @Param('projectName') projectName: string,
  ): Promise<any> {
    try {
      const userId = req.user.userId;
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
