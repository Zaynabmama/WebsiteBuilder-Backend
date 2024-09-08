import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { FileService } from 'src/file/file.service';
import { JSXGeneratorService } from '../jsxgenerate/jsxgenerate.service';
import { writeFile } from 'fs/promises';
import { join } from 'path';
@Injectable()
export class PageService {
    constructor(

        @InjectModel(User.name) private userModel: Model<User>,
         private readonly fileService: FileService,
         private readonly jsxGeneratorService: JSXGeneratorService
        // private readonly componentService: ComponentService,
      ) {}
  
  async createPage(userId: string, projectId: string, createPageDto: CreatePageDto): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
        throw new NotFoundException('Project not found');
    }

    const pageName = createPageDto.name.replace(/\s+/g, '-').toLowerCase();
    // const pageFilePath = join(__dirname, '..', '..', 'projects', user.name, project.name, 'src', 'pages', `${pageName}.jsx`);
    const pageFilePath = join(__dirname, '..', '..', 'projects', project.name, 'src', 'pages', `${pageName}.jsx`);
    await this.fileService.ensureDirectoryExists(pageFilePath);
    


    const newPage = project.pages.create({
        ...createPageDto,
        jsxFilePath: pageFilePath,
    });
    project.pages.push(newPage);
    await user.save();
    await this.createReactPageComponent(pageFilePath, pageName);


    return newPage;
  }

  private async createReactPageComponent(filePath: string, pageName: string): Promise<void> {
    const content = `
import React from 'react';

const ${pageName} = () => (
  <div>
    <h1>${pageName}</h1>
    <p>This is my page</p>
  </div>
);

export default ${pageName};
    `;
    await this.fileService.uploadJsxFile(content, filePath);
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
      // Delete the JSX file
      // await this.fileService.deleteJsxFile(page.jsxFilePath);
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
        
        
      // }
      // async updatePage(pageId: string, updatePageDto: CreatePageDto): Promise<any> {
      //   const page = await this.userModel.findById(pageId);
      //   if (!page) {
      //     throw new NotFoundException('Page not found');
      //   }
      //   Object.assign(page, updatePageDto);
      //   await page.save();
      //   await this.componentService.updateJsxFile(page._id); // Update JSX file
      //   return page;
        }
}
