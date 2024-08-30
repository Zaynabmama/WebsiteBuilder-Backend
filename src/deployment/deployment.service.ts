import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import axios from 'axios';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
@Injectable()
export class DeploymentService {
    @InjectModel(User.name) private userModel: Model<User> 
    constructor(private configService: ConfigService) {}


    async createSiteForUser(userId: string, projectId: string): Promise<string> {
        const apiUrl = this.configService.get<string>('NETLIFY_API_URL');
        const apiKey = this.configService.get<string>('NETLIFY_API_KEY');
      
        const payload = {
            name: `site-${userId.slice(0, 5)}-${projectId.slice(0, 5)}-${Date.now()}`,
        };
      
        console.log('Sending payload to Netlify:', payload);
      
        try {
          const response = await axios.post(apiUrl, payload, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });
      
          const siteId = response.data.id;
          console.log(`Site created with ID: ${siteId}`);
          const url = response.data.ssl_url || response.data.url;
          console.log(`Site created with ID: ${siteId} and URL: ${url}`);
        
          // Save the siteId and url to the database
          await this.saveSiteIdToDeployment(userId, projectId, siteId, url);
        
      
          return siteId;
        } catch (error) {
          console.error('Error creating site on Netlify:', error.response?.data || error.message);
          throw new InternalServerErrorException('Failed to create site on Netlify');
        }
      }
      
      async saveSiteIdToDeployment(userId: string, projectId: string, siteId: string, url: string): Promise<void> {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        const project = user.projects.id(projectId);
        if (!project) {
          throw new NotFoundException('Project not found');
        }
      
        project.deployment = { siteId, status: 'created', url };
        await user.save();
      }
      async deploySite(userId: string, projectId: string): Promise<void> {
        const user = await this.userModel.findById(userId);
        const project = user.projects.id(projectId);
        const siteId = project.deployment.siteId;
      
        const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
        const apiKey = this.configService.get<string>('NETLIFY_API_KEY');
      
        await axios.post(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
      
        project.deployment.status = 'deployed';
        await user.save();
      }
      
      async checkDeploymentStatus(siteId: string): Promise<any> {
        const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
        const apiKey = this.configService.get<string>('NETLIFY_API_KEY');
      
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
      
        return response.data;
      }
      async getJsxFilesForProject(userId: string, projectId: string): Promise<string[]> {
        const user = await this.userModel.findById(userId);
        const project = user.projects.id(projectId);
        
        return project.pages.map(page => page.jsxFilePath);
      }
}
