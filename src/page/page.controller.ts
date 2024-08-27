import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PageService } from './page.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePageDto } from './dto/create-page.dto';

@UseGuards(JwtAuthGuard)
@Controller('project/:projectId/page')
export class PageController {
    constructor(private readonly pageService: PageService) {}


    @Post()
    async createPage(@Req() req  ,@Param('projectId') projectId: string, @Body()createPageDto: CreatePageDto) {
    const userId = req.user.userId; //extract userId from auth request
    return this.pageService.createPage(userId, projectId, createPageDto);
  
  }
  @Get()
  async listPages(
    @Req() req,
    @Param('projectId') projectId: string,
  ) {
    const userId = req.user.userId;
    return this.pageService.listPages(userId, projectId);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':pageId')
  async deletePage(
    @Req() req,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
  ) {
    const userId = req.user.userId;
    await this.pageService.deletePage(userId, projectId, pageId);
  }
}
