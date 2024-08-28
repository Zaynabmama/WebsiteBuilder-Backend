import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  getMulterStorage() {
    return diskStorage({
      // Setting the destination for uploaded files
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads');
        cb(null, uploadPath); // the destination path
      },
      // Configuring the filename of the uploaded file
      filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname); // Get the file extension
        const filename = `${uuidv4()}${fileExtension}`; // Generate a unique filename using UUID
        cb(null, filename); // the final filename
      },
    });
  }
}
