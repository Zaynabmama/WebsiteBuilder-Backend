import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { mkdir, copyFile } from 'fs/promises';
import { join, dirname } from 'path';

@Injectable()
export class FileService {
   async ensureDirectoryExists(filePath: string): Promise<any> {
    const dir = dirname(filePath);
    return fsPromises.mkdir(dir, { recursive: true });
   }

   async copyTemplateToProject(projectDir: string): Promise<void> {
    const templateDir = join(__dirname, '..', '..', 'template');

    try {
      console.log(`Copying template from ${templateDir} to ${projectDir}`);
     
      await fsPromises.cp(templateDir, projectDir, { recursive: true });
      console.log('Template copied successfully.');
    } catch (error) {
      console.error('Error copying template:', error);
      throw new Error('Failed to copy project template');
    }
  }

  async uploadJsxFile(fileContent: string, filePath: string): Promise<void> {
    await this.ensureDirectoryExists(filePath);
    return fsPromises.writeFile(filePath, fileContent, 'utf8');
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
  
