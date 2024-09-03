import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('deployment')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  
  @Post('create-site/:projectId')
  async createSite(
    @Req() req,
    @Param('projectId') projectId: string,
  ): Promise<string> {
    const userId = req.user.userId; 
    return await this.deploymentService.createSiteForUser(userId, projectId);
  }

//   @Post('deploy/:userId/:projectName')
// async deploy(@Param('userId') userId: string, @Param('projectName') projectName: string) {
//   try {
//     await this.deploymentService.deployProject(userId, projectName);
//     return { message: 'Deployment successful' };
//   } catch (error) {
//     throw error;
//   }
// }
@Post('deploy/:userId/:projectId')
async deploy(
  @Req()req,
  @Param('projectId') projectId: string) {
  try {
    const userId = req.user.userId; 
    await this.deploymentService.deployProject(userId, projectId);
    return { message: 'Deployment successful' };
  } catch (error) {
    throw new HttpException(
      { message: 'Deployment failed', error: error.message },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
}

  
  // @Get('status/:siteId')
  // async checkDeploymentStatus(
  //   @Param('siteId') siteId: string,
  // ): Promise<any> {
  //   return await this.deploymentService.checkDeploymentStatus(siteId);
  // }

  // @Get('jsx-files/:projectId')
  // async getJsxFiles(
  //   @Req() req,
  //   @Param('projectId') projectId: string,
  // ): Promise<string[]> {
  //   const userId = req.user.userId; 
  //   return await this.deploymentService.getJsxFilesForProject(userId, projectId);
  // }
