import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import { CreateComponentDto } from './dto/create-component.dto';
import {UpdateComponentDto} from './dto/update-component.dto';

@Injectable()
export class ComponentService {
constructor(
    @InjectModel(User.name) private userModel: Model<User>,// injects the Mongoose model associated with the User schema to interact with the User collection in MongoDB
  ) {}
  async addOrUpdateComponents(userId: string,projectId:string, pageId:string , components: CreateComponentDto[]): Promise<any> {
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
      type ComponentWithOptionalId = CreateComponentDto & { _id?: Types.ObjectId };
      components.forEach((componentDto: ComponentWithOptionalId) => {
        if (componentDto._id) {
          const existingComponent = page.components.id(componentDto._id);
      
          if (existingComponent) {
            console.log(`Updating component with ID: ${componentDto._id}`);
            Object.assign(existingComponent, componentDto);
          } else {
            console.log(`Component with ID: ${componentDto._id} not found, adding as new component`);
            page.components.push(componentDto);
          }
        } else {
          console.log('Add new component without an id.');
          page.components.push(componentDto); // will generate a new id
        }
      });
      
      await user.save();
      
      return page;
      
  //   const existingComponent = page.components.id(componentId);
  //   if (existingComponent) {
  //       Object.assign(existingComponent, componentId);  // Update the component
  //     }
  //   else {
  //       const newComponent = page.components.create(createComponentDto);
  //       page.components.push(newComponent);  // Add new component
  //     }  
      
  //   // page.components.push(newComponent);
  //    await user.save();

  //    return page;

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

async getComponents(userId: string, projectId: string, pageId: string): Promise<any> {
  const user = await this.userModel.findById(userId);
  const project = user.projects.id(projectId);

  const page = project.pages.id(pageId);
  return page.components;
}



}