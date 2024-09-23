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


    if (!fs.existsSync(projectsDir)) {
      throw new Error(`Project directory ${projectsDir} does not exist`);
    }

 
    await this.buildReactProject(projectName);

  
    const deployResponse = await this.deployToNetlify(projectsDir, projectName, netlifyToken);
    await this.updateDeploymentStatus(userId, projectName, 'success', deployResponse.deploy_ssl_url);
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


    const createSiteResponse = await axios.post(
      'https://api.netlify.com/api/v1/sites',
      {},
      {
        headers: {
          Authorization: `Bearer ${netlifyToken}`,
        },
      },
    );

    const siteId = createSiteResponse.data.site_id;

    // Step 3: Deploy the zip file to Netlify
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
}
