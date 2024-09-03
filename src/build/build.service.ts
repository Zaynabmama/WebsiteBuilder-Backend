import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { join } from 'path';

@Injectable()
export class BuildService {
  async buildProject(projectName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!projectName) {
        console.error('Project name is required');
        return;
      }

      console.log(`Starting build for project: ${projectName}`);
      const projectPath = join(__dirname, '..', '..', 'uploads', projectName);

      console.log(`Project path resolved to: ${projectPath}`);


      exec(
        `npm run build`, 
        { cwd: projectPath, shell: 'C:\\Program Files\\Git\\bin\\bash.exe' }, 
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error occurred during build: ${error.message}`);
            console.error(`Error details: ${error.stack}`);
            reject(`Build failed: ${error.message}`);
            return;
          }
        
          if (stderr) {
            console.error(`Standard error output from build: ${stderr}`);
            
          }
        
          console.log(`Standard output from build: ${stdout}`);
          resolve(stdout);
        }
      );
    });
  }
}
