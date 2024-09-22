import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { FileService } from 'src/file/file.service';
import { join } from 'path';

@Injectable()
export class ProjectService {
  constructor(
    
    @InjectModel(User.name) private userModel: Model<User>,// injects the Mongoose model associated with the User schema to interact with the User collection in MongoDB
    private readonly fileService: FileService,
    ) {}

  async createProject(userId: string, createProjectDto: CreateProjectDto): Promise<any> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const projectName = createProjectDto.name.replace(/\s+/g, '-').toLowerCase();
    const projectDir = join(__dirname, '..', '..', 'projects', projectName);


    const existingProject = user.projects.find(
      project => project.name === createProjectDto.name
    );
    if (existingProject) {
      throw new BadRequestException('Project with this name already exists');
    }

    
    const newProject=user.projects.create(createProjectDto as any);
    // const newProject = {
    //   ...createProjectDto,
    //   pages: [],
    // };
    user.projects.push(newProject);
    await user.save();
    await this.fileService.copyTemplateToProject(projectDir);
    
    return newProject;
  }
  


  async listProjects(userId: string): Promise<any[]> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.projects;
  }

    async listAllProjects(): Promise<any[]> {
      const users = await this.userModel.find().populate('projects'); 
      const allProjects = users.flatMap(user => 
        user.projects.map(project => ({
          ...project.toObject(),
          createdBy: user.name 
        }))
      );
      return allProjects;
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

  async deleteProjectById(userId: string, projectId: string): Promise<void> {
    console.log(`User ID: ${userId}`);
    console.log(`Attempting to delete Project ID: ${projectId}`);
  
    const user = await this.userModel.findById(userId).exec();
    console.log(`Fetched User: ${JSON.stringify(user)}`);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.role === 'admin') {
 
      const projectFound = await this.userModel.updateMany(
        { 'projects._id': projectId },
        { $pull: { projects: { _id: projectId } } }
      );
      console.log('Project deleted successfully for admin.');
      return;
    }

    const project = user.projects.id(projectId);
  
    if (!project) {
      console.log('Project not found in user projects');
      throw new NotFoundException('Project not found');
    }
  
    user.projects.pull(projectId);
    await user.save();
    console.log('Project deleted successfully ');
  }
  
  


}