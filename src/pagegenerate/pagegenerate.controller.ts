import { Controller, Post, Param } from '@nestjs/common';
import { PageGeneratorService } from './pagegenerate.service';

@Controller('page-generator')
export class PageGeneratorController {
  constructor(private readonly pageGeneratorService: PageGeneratorService) {}

  @Post('generate/:projectName')
  generateHtmlFiles(@Param('projectName') projectName: string): void {
    this.pageGeneratorService.generateHtmlFilesForPages(projectName);
  }
}
