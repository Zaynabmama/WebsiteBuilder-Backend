import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import axios from 'axios';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';
@Injectable()
export class DeploymentService {
    @InjectModel(User.name) private userModel: Model<User> 
    constructor(private configService: ConfigService) {}
    async createSiteForUser(userId: string, projectId: string): Promise<any> {
        const apiUrl = this.configService.get<string>('NETLIFY_API_URL');
        const apiKey = this.configService.get<string>('NETLIFY_API_KEY');
        console.log(`Netlify API URL: ${apiUrl}`);
        console.log(`Netlify API Key: ${apiKey}`);

        const payload = {
        name: `user-site-${userId}-${projectId}`,
        };
        const response = await axios.post(apiUrl, payload, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });
        const siteId = response.data.id;
        console.log(`Site created with ID: ${siteId}`);
          
        return siteId;  
      }
}
