import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';

@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  
  @Post()
  async createProject(@Req() req , @Body() createProjectDto: CreateProjectDto) {
     const userId = req.user.userId; //extract userId from auth request
    return this.projectService.createProject(userId, createProjectDto);
  }

  @Get()
  async listProjects(@Req() req) {
    const userId = req.user.userId;
    return this.projectService.listProjects(userId);
  }

  @Get(':projectId')
  async getProjectById(@Req() req, @Param('projectId') projectId: string) {
    const userId = req.user.userId;  //extract userId from auth request
    return this.projectService.getProjectById(userId, projectId);
  }
  @Get(':projectName')
  async getProject(@Req() req,@Param('projectName') projectName: string) {
    const userId = req.user.userId;
    return this.projectService.getProject(userId, projectName);
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  async deleteProjectById(@Req() req, @Param('projectId') projectId: string): Promise<void> {
    const userId = req.user.userId; // Extract the authenticated user's ID
    await this.projectService.deleteProjectById(userId, projectId);
  }
}