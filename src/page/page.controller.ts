import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
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

   @Get(':pageId')
   async getPageById(@Req() req, @Param('projectId') projectId: string, @Param('pageId') pageId: string) {
     const userId = req.user.userId;  //extract userId from auth request
     return this.pageService.getPageById(userId, projectId,pageId);
   }
   @Get(':pageId/preview')
   async previewPage(
     @Req() req,  // To access the user details (assuming user info is available in the request)
     @Param('projectId') projectId: string,
     @Param('pageId') pageId: string
   ): Promise<{ previewUrl: string }> {
     const userId = req.user.userId;  // Assuming JWT or session contains user information
     if (!userId) {
       throw new NotFoundException('User not found');
     }
     
     // Call the PageService to generate the preview URL
     return this.pageService.previewPage(userId, projectId, pageId);
   }
 
   // Optional: Return the content of the page for dynamic loading
   @Get(':pageId/content')
   async getPageContent(
     @Req() req,
     @Param('projectId') projectId: string,
     @Param('pageId') pageId: string
   ): Promise<any> {
     const userId = req.userId;
     if (!userId) {
       throw new NotFoundException('User not found');
     }
 
     // Get the actual page content for rendering
     return this.pageService.getPageById(userId, projectId, pageId);
   }


 }
