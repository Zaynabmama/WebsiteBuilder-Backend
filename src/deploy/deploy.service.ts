import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';

@Injectable()
export class NetlifyDeployService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async deployProject(userId: string, projectName: string): Promise<any> {
    const netlifyToken = this.configService.get<string>('NETLIFY_API_TOKEN');
    const projectsDir = path.join(__dirname, `../../projects/${projectName}`);
   
  console.log('Project directory path:', projectsDir);

    if (!fs.existsSync(projectsDir)) {
      throw new Error(`Project directory ${projectsDir} does not exist`);
    }

 
    await this.buildReactProject(projectName);

    const user = await this.userModel.findById(userId);
    const project = user.projects.find(p => p.name === projectName);
    const deployResponse = await this.deployToNetlify(projectsDir, projectName, netlifyToken);
    await this.updateDeploymentStatus(userId, project._id.toString(), 'deployed', deployResponse.deploy_ssl_url);
    return deployResponse;
  }

  private buildReactProject(projectName: string): Promise<void> {
    const projectsDir = path.join(__dirname, `../../projects/${projectName}`);
    return new Promise((resolve, reject) => {
      const command = `npm run build --prefix ${projectsDir}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error during React project build:', error.message);
          reject(`Build failed: ${error.message}`);
          return;
        }

        console.log('Build output:', stdout);
        if (stderr) {
          console.error('Build warnings/errors:', stderr);
        }

        resolve();
      });
    });
  }

  private async deployToNetlify(
    projectDir: string,
    projectName: string,
    netlifyToken: string,
  ): Promise<any> {
  
    const buildDir = path.join(projectDir, 'build');
    const zipFilePath = path.join(projectDir, `${projectName}-build.zip`);

    await this.zipBuildDirectory(buildDir, zipFilePath);



    const siteId = this.configService.get<string>('NETLIFY_TEMPLATE_SITE_ID');

    
    const deployResponse = await axios.post(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
      fs.createReadStream(zipFilePath),
      {
        headers: {
          Authorization: `Bearer ${netlifyToken}`,
          'Content-Type': 'application/zip',
        },
      },
    );

    return deployResponse.data;
  }

  private async zipBuildDirectory(buildDir: string, zipFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, 
      });

      output.on('close', () => {
        console.log(`Zipped ${archive.pointer()} total bytes`);
        resolve();
      });

      archive.on('error', (err) => {
        console.error('Error during zip:', err);
        reject(err);
      });

      archive.pipe(output);
      archive.directory(buildDir, false);
      archive.finalize();
    });
  }
  private async updateDeploymentStatus(userId: string, projectId: string, status: string, liveUrl?: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('User found:', user);

    const project = user.projects.id(projectId);
    if (!project) {
      console.error('Project ID:', projectId);
      console.log('User projects:', user.projects);
      throw new NotFoundException('Project not found');
    }
    if (!project.deployment) {
      project.deployment = {
        status: '',
      }
      console.log('Initialized deployment object for project');
    }

    project.deployment.status = status;
    if (liveUrl) {
      project.deployment.url = liveUrl;
    }

    await user.save();
  }
}
