import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private baseUploadPath = path.resolve(__dirname, '..', '..', 'uploads');
  async uploadJsxFile(content: string, filePath: string): Promise<void> {
    const fullPath = path.join(this.baseUploadPath, filePath);
    try {
        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
        console.log(`created: ${path.dirname(fullPath)}`); // Debugging info
        await fs.promises.writeFile(fullPath, content, 'utf8');
        console.log(`write: ${fullPath}`); // Debugging info
    } catch (error) {
        console.error(`Error writing JSX file to ${fullPath}:`, error); // Error logging
        throw new Error(`Failed to write JSX file to ${fullPath}`);
    }
}

  async deleteJsxFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.baseUploadPath, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
