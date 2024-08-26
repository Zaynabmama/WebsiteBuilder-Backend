import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
}