import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
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
}
