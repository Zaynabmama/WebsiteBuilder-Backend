import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import path, { dirname } from 'path';

@Injectable()
export class FileService {
  
  async uploadJsxFile(fileContent: string, filePath: string): Promise<void> {
    try {
      
      await this.ensureDirectoryExists(dirname(filePath));

      console.log(`Saving JSX file to: ${filePath}`);
      await writeFile(filePath, fileContent);
      console.log('JSX file saved successfully!');
    } catch (err) {
      console.error(`Failed to write file: ${err.message}`);
      throw new InternalServerErrorException('Error writing the JSX file');
    }
  }
  private async ensureDirectoryExists(directoryPath: string): Promise<void> {
    try {
      await mkdir(directoryPath, { recursive: true });
    } catch (err) {
      throw new InternalServerErrorException(`Error creating directory: ${err.message}`);
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
  
}
