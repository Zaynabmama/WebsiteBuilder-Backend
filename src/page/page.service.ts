import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { FileService } from 'src/file/file.service';
import { JSXGeneratorService } from '../jsxgenerate/jsxgenerate.service';
import { writeFile, mkdir } from 'fs';
import { join } from 'path';
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

    // const projectDir = project.name.replace(/\s+/g, '-').toLowerCase();
    // const pageDir = createPageDto.name.replace(/\s+/g, '-').toLowerCase();
    // const jsxFilePath = `${projectDir}/${pageDir}.jsx`;
    const projectDir = project.name.replace(/\s+/g, '-').toLowerCase();
    const projectPath = join(__dirname, '..', '..', 'uploads', projectDir);
    const srcPath = join(projectPath, 'src');
    const pageDir = createPageDto.name.replace(/\s+/g, '-').toLowerCase();
    const jsxFilePath = join(srcPath, `${pageDir}.jsx`);

    console.log('Project Path:', projectPath);
    console.log('JSX File Path:', jsxFilePath);

    // Ensure the project and src folders are created
    await this.ensureProjectFolder(projectPath);
    await this.ensureProjectFolder(srcPath);

    // Create or update the package.json file
    await this.createOrUpdatePackageJson(projectPath, project.name);

    const newPage = project.pages.create({
        ...createPageDto,
        jsxFilePath: jsxFilePath,
    });
    project.pages.push(newPage);

    const jsxContent = this.jsxGeneratorService.generateJsxContent([]);
    console.log('JSX Content:', jsxContent);

    await this.fileService.uploadJsxFile(jsxContent, jsxFilePath);
    await user.save();

    return newPage;
  }

  private ensureProjectFolder(folderPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Failed to create folder:', err.message);
          reject(`Failed to create folder: ${err.message}`);
        } else {
          resolve();
        }
      });
    });
  }

  private createOrUpdatePackageJson(projectPath: string, projectName: string): Promise<void> {
    const packageJsonPath = join(projectPath, 'package.json');
    const packageJsonContent = JSON.stringify({
      name: projectName,
      version: "1.0.0",
      description: `Package for project ${projectName}`,
      scripts: {
        build: "babel src --out-dir dist"
      },
      devDependencies: {
        "@babel/cli": "^7.x.x",
        "@babel/core": "^7.x.x",
        "@babel/preset-react": "^7.x.x",
        "@babel/preset-env": "^7.x.x"
      },
      babel: {
        presets: ["@babel/preset-env", "@babel/preset-react"]
      }
    }, null, 2); // Formatting with indentation

    return new Promise((resolve, reject) => {
      writeFile(packageJsonPath, packageJsonContent, (err) => {
        if (err) {
          console.error('Failed to create or update package.json:', err.message);
          reject(`Failed to create or update package.json: ${err.message}`);
        } else {
          resolve();
        }
      });
    });
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
