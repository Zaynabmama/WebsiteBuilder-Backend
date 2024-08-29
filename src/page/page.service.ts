import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { FileService } from 'src/file/file.service';
import { JSXGeneratorService } from '../jsxgenerate/jsxgenerate.service';
@Injectable()
export class PageService {
    constructor(

        @InjectModel(User.name) private userModel: Model<User>,
         private readonly fileService: FileService,
         private readonly jsxGeneratorService: JSXGeneratorService
        // private readonly componentService: ComponentService,
      ) {}
  //     async createPage(userId: string, projectId: string, createPageDto: CreatePageDto): Promise<any> {
  //       const user = await this.userModel.findById(userId);
  //       if (!user) {
  //           throw new NotFoundException('User not found');
  //         }
  //       const project = user.projects.id(projectId);
  //       //const jsxFilePath = `src/projects/${projectId}/${createPageDto.name}.jsx`;
    
  //       if (!project) {
  //           throw new NotFoundException('Project not found');
  //       }
  //       //const newPage=user.projects.push(createPageDto as any);
  //       const jsxFilename = `page-${createPageDto.name}.jsx`;
  //       const newPage = project.pages.create({
  //         ...createPageDto,
  //         jsxFilePath: jsxFilename,
  //       });
  //       project.pages.push(newPage);
  //       const jsxContent = this.generateInitialJsxContent();
        
  //       await this.fileService.uploadJsxFile(jsxContent, jsxFilename);
  //       await user.save();
  //       return newPage
  //     }
  // generateInitialJsxContent() : string  {
  //   return `<div>\n</div>`;
  // }
  async createPage(userId: string, projectId: string, createPageDto: CreatePageDto): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
        throw new NotFoundException('Project not found');
    }

    const projectDir = project.name.replace(/\s+/g, '-').toLowerCase();
    const pageDir = createPageDto.name.replace(/\s+/g, '-').toLowerCase();
    const jsxFilePath = `${projectDir}/${pageDir}.jsx`;

    
    const newPage = project.pages.create({
        ...createPageDto,
        jsxFilePath: `${jsxFilePath}`,
    });
    project.pages.push(newPage);

    // const jsxContent = this.generateJsxContent([]);

    // await this.fileService.uploadJsxFile(jsxContent, jsxFilePath);
    // await user.save();

    
    // return newPage;
 
    await user.save();

    // Generate and save the JSX file
    await this.jsxGeneratorService.generateAndSaveJsxFile(newPage.components, jsxFilePath);

    return newPage;
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
      await this.fileService.deleteJsxFile(page.jsxFilePath);
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
