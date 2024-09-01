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

  // Create a new site on Netlify for the user's project
  @Post('create-site/:projectId')
  async createSite(
    @Req() req,
    @Param('projectId') projectId: string,
  ): Promise<string> {
    const userId = req.user.userId; // Extract userId from JWT token
    return await this.deploymentService.createSiteForUser(userId, projectId);
  }

  // Deploy the user's project by building it and deploying to Netlify
  @Post('deploy/:projectId/:projectName')
  async deployProject(
    @Req() req,
    @Param('projectId') projectId: string,
    @Param('projectName') projectName: string,
  ): Promise<void> {
    const userId = req.user.userId; // Extract userId from JWT token
    await this.deploymentService.deployProject(userId, projectId);
  }

  // Check the deployment status on Netlify for a specific site
  @Get('status/:siteId')
  async checkDeploymentStatus(
    @Param('siteId') siteId: string,
  ): Promise<any> {
    return await this.deploymentService.checkDeploymentStatus(siteId);
  }

  // Retrieve JSX files associated with a specific user's project
  @Get('jsx-files/:projectId')
  async getJsxFiles(
    @Req() req,
    @Param('projectId') projectId: string,
  ): Promise<string[]> {
    const userId = req.user.userId; // Extract userId from JWT token
    return await this.deploymentService.getJsxFilesForProject(userId, projectId);
  }
}
