import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file')) //file:form field that contains the file

    uploadFile(@UploadedFile() file: Express.Multer.File) {
        
        return {
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
        }; 
    }
    
}
