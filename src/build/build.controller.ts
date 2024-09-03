import { Controller, Post, Body } from '@nestjs/common';
import { BuildService } from './build.service';

@Controller('build')
export class BuildController {
  constructor(private readonly buildService: BuildService) {}

  @Post()
  async build(@Body('projectName') projectName: string) {
    const result = await this.buildService.buildProject(projectName);
    return { message: 'Build successful', result };
  }
}
