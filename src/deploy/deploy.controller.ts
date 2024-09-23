import { Controller, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { NetlifyDeployService } from './deploy.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('deploy')
export class NetlifyDeployController {
  constructor(private readonly netlifyDeployService: NetlifyDeployService) {}

  @Post(':projectName')
  async deploy(
    @Req() req,
    @Param('projectName') projectName: string,
  ): Promise<any> {
    console.log('Received project name:', projectName);
 
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
