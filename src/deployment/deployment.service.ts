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
import * as FormData from 'form-data';
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

    const payload = {
      name: `site-${userId.slice(0, 5)}-${projectId.slice(0, 5)}-${Date.now()}`,
    };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const siteId = response.data.id;
      const url = response.data.ssl_url || response.data.url;

      await this.saveSiteIdToDeployment(userId, projectId, siteId, url);

      return siteId;
    } catch (error) {
      console.error('Error creating site on Netlify:', error.response?.data || error.message);
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

    const projectDirectory = path.resolve(process.cwd(), 'uploads', project.name);

    if (!fs.existsSync(projectDirectory)) {
      throw new NotFoundException(`Project directory not found: ${projectDirectory}`);
    }

    console.log(`Project directory found at ${projectDirectory}`);

    // Build the user's project
    await this.buildUserProject(projectDirectory);

    // Deploy the built static file to Netlify
    const buildFile = path.join(projectDirectory, 'build', 'pleasework.js');
    await this.deploySingleFileToNetlify(project.deployment.siteId, buildFile);

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
          const buildPath = path.join(directory, 'build');
          if (!fs.existsSync(buildPath)) {
            console.error(`Build directory not found at ${buildPath}`);
            reject(new InternalServerErrorException('Build directory not found after build process.'));
          } else {
            console.log(`Build directory found at ${buildPath}`);
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
                'Authorization': `Bearer ${apiKey}`,
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


  async checkDeploymentStatus(siteId: string): Promise<any> {
    const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
    const apiKey = this.configService.get<string>('NETLIFY_API_KEY');

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking deployment status:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to check deployment status on Netlify');
    }
  }

  async getJsxFilesForProject(userId: string, projectId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project.pages.map((page) => page.jsxFilePath);
  }
}
