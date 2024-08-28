import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class PageService {
    constructor(

        @InjectModel(User.name) private userModel: Model<User>,
         private readonly fileService: FileService
      ) {}
      async createPage(userId: string, projectId: string, createPageDto: CreatePageDto): Promise<any> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
          }
        const project = user.projects.id(projectId);
        //const jsxFilePath = `src/projects/${projectId}/${createPageDto.name}.jsx`;
    
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        //const newPage=user.projects.push(createPageDto as any);
        const jsxFilename = `page-${createPageDto.name}.jsx`;
        const newPage = project.pages.create({
          ...createPageDto,
          jsxFilePath: jsxFilename, // Set the jsxFilePath here
        });
        project.pages.push(newPage);
        const jsxContent = this.generateInitialJsxContent();
        
        await this.fileService.uploadJsxFile(jsxContent, jsxFilename); // Save JSX content to a file
        await user.save();
        return newPage
      }
  generateInitialJsxContent() : string  {
    return `<div>\n</div>`;
  }
      async listPages(userId: string, projectId: string): Promise<any[]> {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        const project = user.projects.id(projectId);
        if (!project) {
          throw new NotFoundException('Project not found');
        }
    
        return project.pages;
      }

      async deletePage(userId: string, projectId: string, pageId: string): Promise<any> {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        const project = user.projects.id(projectId);
        if (!project) {
          throw new NotFoundException('Project not found');
        }
    
        const page = project.pages.id(pageId);
        if (!page) {
          throw new NotFoundException('Page not found');
        }
    
        project.pages.pull(pageId);
        await user.save();
    
      }
      async getPageById(userId: string, projectId: string, pageId:string): Promise<any> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
          }
          const project = user.projects.id(projectId);
          if (!project) {
            throw new NotFoundException('Project not found');
          }
          const page = project.pages.id(pageId);
          if (!page) {
          throw new NotFoundException('Page not found');
          }
      
          return page;
        
        
      }
}
