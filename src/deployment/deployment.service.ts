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
import { createHash } from 'crypto';

@Injectable()
export class DeploymentService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async oneClickDeploy(userId: string, projectname: string, projectId: string): Promise<string> {
    try {
    
      const buildDir = await this.buildReactProject(projectname);

      
      let siteId = await this.getExistingSiteId(userId, projectId);
      if (!siteId) {
        siteId = await this.createSiteForUser(userId, projectId);
      }

      const liveUrl = await this.deployToNetlify(siteId, buildDir);

      console.log(`Deployment successful: ${liveUrl}`);

      await this.updateDeploymentStatus(userId, projectId, 'deployed', liveUrl);

      return liveUrl;
    } catch (error) {
      console.error('One-click deployment failed:', error.message);
      throw new InternalServerErrorException('Deployment failed');
    }
  }

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

  async buildReactProject(projectname: string): Promise<string> {
    const projectPath = path.join(__dirname, `../../projects/${projectname}`);

    return new Promise((resolve, reject) => {
      const command = `npm run build --prefix ${projectPath}`;

      exec(command, (error, stdout, stderr) => {
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


  async deployToNetlify(siteId: string, buildDir: string): Promise<string> {
    const files = await this.getFilesFromDirectory(buildDir); 
    const apiUrl = this.configService.get<string>('NETLIFY_API_URL');
    const apiKey = this.configService.get<string>('NETLIFY_API_KEY');

    try {
      const fileHashes: { [key: string]: string } = {};
      for (const file of files) {
        const sha1 = await this.calculateSHA1(path.join(buildDir, file.path));
        fileHashes[file.path] = sha1;
      }

      const response = await axios.post(
        `${apiUrl}/${siteId}/deploys`,
        { files: fileHashes },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const deployId = response.data.id;
      const liveUrl = response.data.deploy_ssl_url || response.data.url;
      const requiredFiles = response.data.required;

    
      await this.uploadFilesToNetlify(deployId, buildDir, files, requiredFiles);

      console.log('Deployment successful:', liveUrl);
      return liveUrl;
    } catch (error) {
      console.error('Error during deployment:', error.response?.data || error.message);
      throw new Error('Deployment failed');
    }
  }


  private async calculateSHA1(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha1');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }

  private async uploadFilesToNetlify(deployId: string, buildDir: string, files: { path: string; content: string }[], requiredFiles: string[]): Promise<void> {
    const apiUrl = this.configService.get<string>('NETLIFY_API_URL');
    const apiKey = this.configService.get<string>('NETLIFY_API_KEY');

    for (const file of files) {
      if (requiredFiles.includes(file.path)) {
        const filePath = path.join(buildDir, file.path);

        try {
          await axios.put(
            `${apiUrl}/deploys/${deployId}/files/${file.path}`,
            fs.createReadStream(filePath),
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/octet-stream',
              },
            }
          );
          console.log(`Uploaded file: ${file.path}`);
        } catch (error) {
          console.error(`Failed to upload ${file.path}:`, error.response?.data || error.message);
          throw new Error('File upload failed');
        }
      }
    }
  }

  private async getFilesFromDirectory(buildDir: string): Promise<{ path: string; content: string }[]> {
    const files = [];
    const directoryPath = path.resolve(buildDir);

    const readDirectory = async (dir: string) => {
      const fileNames = await fs.promises.readdir(dir);
      await Promise.all(fileNames.map(async (fileName) => {
        const filePath = path.join(dir, fileName);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
          await readDirectory(filePath);  
        } else {
          const fileContent = await fs.promises.readFile(filePath, 'utf-8'); 
          const relativePath = path.relative(buildDir, filePath); 

          files.push({
            path: relativePath,  
            content: fileContent, 
          });
        }
      }));
    };

    await readDirectory(directoryPath); 
    return files; 
  }


  private async updateDeploymentStatus(
    userId: string,
    projectId: string,
    status: string,
    liveUrl?: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.deployment.status = status;
    if (liveUrl) {
      project.deployment.url = liveUrl;
    }

    await user.save();
  }

   private async getExistingSiteId(userId: string, projectId: string): Promise<string | null> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.deployment && project.deployment.siteId) {
      return project.deployment.siteId;
    }

    return null; 
  }
}

