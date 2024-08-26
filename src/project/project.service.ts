import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    
    @InjectModel(User.name) private userModel: Model<User>,// injects the Mongoose model associated with the User schema to interact with the User collection in MongoDB
  ) {}

  async createProject(userId: string, createProjectDto: CreateProjectDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    user.projects.push(createProjectDto as any);
    await user.save();
    
    return user;
  }
  async listProjects(userId: string): Promise<any[]> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.projects;
  }
  async getProjectById(userId: string, projectId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    
  }


}