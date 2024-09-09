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
}