import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { mkdir, copyFile } from 'fs/promises';
import { join } from 'path';
import { readdir } from 'fs/promises';

@Injectable()
export class ProjectService {
  constructor(
    
    @InjectModel(User.name) private userModel: Model<User>,// injects the Mongoose model associated with the User schema to interact with the User collection in MongoDB
  ) {}

  async createProject(userId: string, createProjectDto: CreateProjectDto): Promise<any> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const projectName = createProjectDto.name.replace(/\s+/g, '-').toLowerCase();
    const userFolder = join(__dirname, '..', '..', 'projects', user.name); // User folder path
    const projectFolder = join(userFolder, projectName); // Project folder path

    const existingProject = user.projects.find(
      project => project.name === createProjectDto.name
    );
    if (existingProject) {
      throw new BadRequestException('Project with this name already exists');
    }

   
    try {
      await mkdir(projectFolder, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException('Could not create project directory');
    }
    await this.copyTemplate(projectFolder);
    
    const newProject=user.projects.create(createProjectDto as any);
    // const newProject = {
    //   ...createProjectDto,
    //   pages: [],
    // };
    user.projects.push(newProject);
    await user.save();
    
    return newProject;
  }
  private async copyTemplate(destination: string): Promise<void> {
    const templatePath = join(__dirname, '..', '..', 'template');
    const copyRecursive = async (src: string, dest: string) => {
      const entries = await readdir(src, { withFileTypes: true });
      await mkdir(dest, { recursive: true });

      for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
          await copyRecursive(srcPath, destPath);
        } else {
          await copyFile(srcPath, destPath);
        }
      }
    };

    try {
      await copyRecursive(templatePath, destination);
    } catch (error) {
      console.error('Error copying template:', error);
      throw new InternalServerErrorException('Failed to copy React template');
    }
  }


  async listProjects(userId: string): Promise<any[]> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.projects;
  }
  async getProject(userId: string, projectName: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const project = user.projects.find(project => project.name === projectName);
    if (!project) throw new NotFoundException('Project not found');

    return project;
  }
  async getProjectById(userId: string, projectId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
      }
      const project = user.projects.id(projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
  
      return project;
    
    
  }

  async deleteProjectById(userId: string, projectId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const project = user.projects.id(projectId);
  
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  
    user.projects.pull(projectId);
    
    await user.save();
  
  }
  


}