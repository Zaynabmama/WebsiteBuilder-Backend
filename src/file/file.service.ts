import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private baseUploadPath = path.resolve(__dirname, '..', '..', 'uploads');

  async uploadJsxFile(content: string, filePath: string): Promise<void> {
    let fullPath = filePath;


    if (!path.isAbsolute(filePath)) {
      fullPath = path.join(this.baseUploadPath, filePath);
    }

    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });

   
    await fs.promises.writeFile(fullPath, content, 'utf8');
  }

  async deleteJsxFile(filePath: string): Promise<void> {
    let fullPath = filePath;


    if (!path.isAbsolute(filePath)) {
      fullPath = path.join(this.baseUploadPath, filePath);
    }

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
