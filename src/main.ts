import * as dotenv from 'dotenv';
dotenv.config(); 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Nest application is starting...');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe());
  await app.listen(process.env.PORT , () => {
    console.log(`Application is running on: http://localhost:${process.env.PORT }`);
  });
}
bootstrap();
