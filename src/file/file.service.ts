import { Injectable } from '@nestjs/common';
import { writeFile, mkdir, copyFile } from 'fs';
import { join, dirname } from 'path';
import { promises as fsPromises } from 'fs';

@Injectable()
export class FileService {
   async ensureDirectoryExists(filePath: string): Promise<void> {
    const dir = dirname(filePath);
    return new Promise((resolve, reject) => {
      mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async copyTemplateToProject(projectDir: string): Promise<void> {
    const templateDir = join(__dirname, '..', '..', 'template');
    
    await fsPromises.cp(templateDir, projectDir, { recursive: true });
  }
  async uploadJsxFile(fileContent: string, filePath: string): Promise<void> {
    await this.ensureDirectoryExists(filePath);
    return new Promise((resolve, reject) => {
      writeFile(filePath, fileContent, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

  // async deleteJsxFile(filePath: string): Promise<void> {
  //   let fullPath = filePath;


  //   if (!path.isAbsolute(filePath)) {
  //     fullPath = path.join(this.baseUploadPath, filePath);
  //   }

  //   if (fs.existsSync(fullPath)) {
  //     fs.unlinkSync(fullPath);
  //   }
  
