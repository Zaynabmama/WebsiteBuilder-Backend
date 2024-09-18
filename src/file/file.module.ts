import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                  const uploadPath = path.join(__dirname, '..', '..', 'uploads');
                  cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                  const fileExtension = path.extname(file.originalname);
                  const filename = `${uuidv4()}${fileExtension}`;
                  cb(null, filename);
                },
              }),
        }),
      ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
