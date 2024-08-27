import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreatePageDto } from './dto/create-page.dto';

@Injectable()
export class PageService {
    constructor(

        @InjectModel(User.name) private userModel: Model<User>,
      ) {}
      async createPage(userId: string, projectId: string, createPageDto: CreatePageDto): Promise<any> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
          }
        const project = user.projects.id(projectId);
        const jsxFilePath = `src/projects/${projectId}/${createPageDto.name}.jsx`;
    
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        const newPage=user.projects.push(createPageDto as any);
    
        project.pages.push(createPageDto as any);


        await user.save();
        return newPage
  
      }
}
