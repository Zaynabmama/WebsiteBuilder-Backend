import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
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

  @Post('deploy/:projectId/:projectName')
  async deployProject(
    @Req() req,
    @Param('projectId') projectId: string,
    @Param('projectName') projectName: string,
  ): Promise<void> {
    const userId = req.user.userId; 
    await this.deploymentService.deployProject(userId, projectId);
  }

  
  @Get('status/:siteId')
  async checkDeploymentStatus(
    @Param('siteId') siteId: string,
  ): Promise<any> {
    return await this.deploymentService.checkDeploymentStatus(siteId);
  }

  @Get('jsx-files/:projectId')
  async getJsxFiles(
    @Req() req,
    @Param('projectId') projectId: string,
  ): Promise<string[]> {
    const userId = req.user.userId; 
    return await this.deploymentService.getJsxFilesForProject(userId, projectId);
  }
}
