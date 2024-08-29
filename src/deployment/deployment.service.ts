import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class DeploymentService {
    constructor(private configService: ConfigService) {}
    async createSiteForUser(userId: string, projectId: string): Promise<any> {
        const apiUrl = this.configService.get<string>('NETLIFY_API_URL');
        const apiKey = this.configService.get<string>('NETLIFY_API_KEY');
      }
}
