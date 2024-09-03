import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

@Injectable()
export class DeploymentService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async createSiteForUser(userId: string, projectId: string): Promise<string> {
    const apiUrl = this.configService.get<string>('NETLIFY_API_URL');
    const apiKey = this.configService.get<string>('NETLIFY_API_KEY');
  
    console.log('Netlify API URL:', apiUrl);
    console.log('Netlify API Key:', apiKey ? 'Provided' : 'Missing');
  
    const payload = {
      name: `site-${userId.slice(0, 5)}-${projectId.slice(0, 5)}-${Date.now()}`,
    };
  
    console.log('Payload for Netlify site creation:', payload);
  
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
  
      const siteId = response.data.id;
      const url = response.data.ssl_url || response.data.url;
  
      console.log('Site created successfully:', { siteId, url });
  
      await this.saveSiteIdToDeployment(userId, projectId, siteId, url);
  
      return siteId;
    } catch (error) {
      console.error('Error creating site on Netlify:', error.response?.data || error.message);
      console.error('Full error details:', error.toJSON ? error.toJSON() : error);
      throw new InternalServerErrorException('Failed to create site on Netlify');
    }
  }
  

  private async saveSiteIdToDeployment(
    userId: string,
    projectId: string,
    siteId: string,
    url: string,
  ): Promise<void> {
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

  async deployProject(userId: string, projectId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const project = user.projects.id(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  
  
    if (!project.deployment || !project.deployment.siteId) {
      console.log('Site ID not found, creating site...');
      const siteId = await this.createSiteForUser(userId, projectId);
      project.deployment.siteId = siteId;
      await user.save();
    }
  
    const projectDirectory = path.resolve(process.cwd(), 'uploads', project.name);
  
    if (!fs.existsSync(projectDirectory)) {
      throw new NotFoundException(`Project directory not found: ${projectDirectory}`);
    }
  
    console.log(`Project directory found at ${projectDirectory}`);
  
 
    await this.buildUserProject(projectDirectory);
  

    const distPath = path.join(projectDirectory, 'dist');
    if (!fs.existsSync(distPath)) {
      throw new NotFoundException(`Dist directory not found at ${distPath}`);
    }
  
    console.log(`Dist directory found at ${distPath}`);
  
  
    const files = fs.readdirSync(distPath);
    for (const file of files) {
      const filePath = path.join(distPath, file);
      await this.deploySingleFileToNetlify(project.deployment.siteId, filePath);
    }
  
    project.deployment.status = 'deployed';
    await user.save();
  }
  
  private async buildUserProject(directory: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec('npm run build', { cwd: directory }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Build failed: ${stderr}`);
          reject(new InternalServerErrorException('Failed to build the user project'));
        } else {
          console.log(`Build output: ${stdout}`);
  
        
          const distPath = path.join(directory, 'dist');
          if (!fs.existsSync(distPath)) {
            console.error(`Dist directory not found at ${distPath}`);
            reject(new NotFoundException(`Dist directory not found at ${distPath}`));
          } else {
            console.log(`Dist directory found at ${distPath}`);
            resolve(); 
          }
        }
      });
    });
  }
  

  private async deploySingleFileToNetlify(siteId: string, filePath: string): Promise<void> {
    const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
    const apiKey = this.configService.get<string>('NETLIFY_API_KEY');

    try {
      const fileStream = fs.createReadStream(filePath);
      const fileName = path.basename(filePath);

      console.log(`Uploading file: ${fileName}`);

      const response = await axios.post(apiUrl, fileStream, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log('Deployment to Netlify successful:', response.data);
    } catch (error) {
      console.error('Error deploying to Netlify:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to deploy site on Netlify');
    }
  }
}

