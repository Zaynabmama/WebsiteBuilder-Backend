import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PageService } from './page.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('page')
export class PageController {
    constructor(private readonly pageService: PageService) {}


    @Post()
    async createProject(@Req() req) {
    const userId = req.user.userId; //extract userId from auth request
  }
}
