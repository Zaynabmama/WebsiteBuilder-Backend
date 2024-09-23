import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('deployment')

export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}


  @Post(':projectId')
  async deployProject(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body('projectname') projectname: string,
  ): Promise<{ liveUrl: string }> {
    try {
      
      const userId = req.user.userId;
      const liveUrl = await this.deploymentService.oneClickDeploy(userId,projectname, projectId);
      return { liveUrl }; 
    } catch (error) {
      console.error('Deployment failed:', error.message);
      throw new InternalServerErrorException('Failed to deploy the project');
    }
  }
}

