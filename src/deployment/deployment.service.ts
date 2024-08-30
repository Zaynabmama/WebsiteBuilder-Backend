import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import { PageGeneratorService } from 'src/pagegenerate/pagegenerate.service';

@Injectable()
export class DeploymentService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly pageGeneratorService: PageGeneratorService
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

  // Save the created site ID and URL in the user's project
  private async saveSiteIdToDeployment(userId: string, projectId: string, siteId: string, url: string): Promise<void> {
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

  // Main method to deploy the project: generate HTML, transpile JSX, and deploy
  async deployProject(userId: string, projectId: string, projectName: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const siteId = project.deployment.siteId;
    if (!siteId) {
      throw new NotFoundException('No site ID found for deployment.');
    }

    // Ensure the project directory exists
    const projectDirectory = path.resolve(process.cwd(), 'uploads', projectName);
  if (!fs.existsSync(projectDirectory)) {
    throw new NotFoundException(`Project directory not found: ${projectDirectory}`);
  }
    // Step 1: Generate HTML files from JSX
    this.pageGeneratorService.generateHtmlFilesForPages(projectName);

    // Step 2: Transpile JSX files to JavaScript
    await this.transpileJSXFiles(projectDirectory);

    // Step 3: Deploy files to Netlify
    await this.deployStaticFilesToNetlify(siteId, projectDirectory);

    // Update deployment status
    project.deployment.status = 'deployed';
    await user.save();
  }

  // Helper method to transpile JSX files to JavaScript using Babel
  private async transpileJSXFiles(directory: string): Promise<void> {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
      exec(
        `npx babel ${directory} --out-dir ${directory} --extensions ".jsx" --presets @babel/preset-react`,
        (error: any, stdout: string, stderr: string) => {
          if (error) {
            console.error(`Error transpiling JSX files: ${stderr}`);
            reject(new InternalServerErrorException('Failed to transpile JSX files'));
          } else {
            console.log(`Transpiled JSX files: ${stdout}`);
            resolve();
          }
        }
      );
    });
  }

  // Deploy static files (HTML, JS) to Netlify
  private async deployStaticFilesToNetlify(siteId: string, projectDirectory: string): Promise<void> {
    const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
    const apiKey = this.configService.get<string>('NETLIFY_API_KEY');

    const form = new FormData();
    const files = fs.readdirSync(projectDirectory);

    try {
      // Append each file as a stream to the form data
      files.forEach(file => {
        const filePath = path.join(projectDirectory, file);
        form.append(`files[${file}]`, fs.createReadStream(filePath), file);
      });

      const headers = {
        Authorization: `Bearer ${apiKey}`,
        ...form.getHeaders(), // Include the correct headers for multipart form data
      };

      const response = await axios.post(apiUrl, form, { headers });

      console.log('Deployment to Netlify successful.');
    } catch (error) {
      console.error('Error deploying to Netlify:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to deploy site on Netlify');
    }
  }

  // Redeploy the existing site on Netlify
  async redeploySite(userId: string, projectId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const siteId = project.deployment.siteId;
    if (!siteId) {
      throw new NotFoundException('No site ID found for redeployment.');
    }

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

  // Check the deployment status on Netlify
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

  // Retrieve JSX files for a given project
  async getJsxFilesForProject(userId: string, projectId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = user.projects.id(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project.pages.map(page => page.jsxFilePath);
  }
}
