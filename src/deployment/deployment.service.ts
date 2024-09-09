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

  async buildReactProject(projectname: string): Promise<string> {
    const projectPath = path.join(__dirname, `../../projects/${projectname}`);

    return new Promise((resolve, reject) => {
      exec(`npm run build`, { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error during React project build:', error.message);
          reject(`Build failed: ${error.message}`);
          return;
        }

        console.log('Build output:', stdout);
        console.error('Build errors:', stderr);

       
        resolve(path.join(projectPath, 'build'));
      });
    });
  }


  private async getFilesFromDirectory(buildDir: string): Promise<{ path: string; content: string }[]> {
    const files = [];
    const directoryPath = path.resolve(buildDir);

    const readDirectory = (dir: string) => {
      const fileNames = fs.readdirSync(dir);
      fileNames.forEach((fileName) => {
        const filePath = path.join(dir, fileName);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          readDirectory(filePath);
        } else {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const relativePath = path.relative(buildDir, filePath);

          files.push({
            path: relativePath,
            content: fileContent,
          });
        }
      });
    };

    readDirectory(directoryPath);

    return files;
  }

}