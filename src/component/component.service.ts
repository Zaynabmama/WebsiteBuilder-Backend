import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreateComponentDto } from './dto/create-component.dto';
import {UpdateComponentDto} from './dto/update-component.dto';

@Injectable()
export class ComponentService {
constructor(
    @InjectModel(User.name) private userModel: Model<User>,// injects the Mongoose model associated with the User schema to interact with the User collection in MongoDB
  ) {}
  async addComponent(userId: string,projectId:string, pageId:string , createComponentDto: CreateComponentDto): Promise<any> {
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
    const newComponent = page.components.create(createComponentDto);
    page.components.push(newComponent);
    await user.save();

    return newComponent;

  }
  async deleteComponent(userId: string, projectId: string, pageId: string, componentId: string): Promise<any> {
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

    const component = page.components.id(componentId);
    if (!component) {
        throw new NotFoundException('Component not found');
    }

    page.components.pull(componentId);
    await user.save();

    return { message: 'Component deleted successfully' };
}
async updateComponent(userId: string, projectId: string, pageId: string, componentId: string, updateComponentDto: UpdateComponentDto): Promise<any> {
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

  const component = page.components.id(componentId);
  if (!component) {
      throw new NotFoundException('Component not found');
  }

  Object.assign(component, updateComponentDto);
  await user.save();

  return component;
}


}