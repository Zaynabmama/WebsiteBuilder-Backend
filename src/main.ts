import * as dotenv from 'dotenv';
dotenv.config(); 

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create the Nest application instance
  const app = await NestFactory.create(AppModule);
  console.log('Nest application is starting...');
  
  // Enable CORS for the frontend URL
  app.enableCors({
    origin: 'http://localhost:3000', // The frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent across domains
  });

  // Use global validation pipes for request validation
  app.useGlobalPipes(new ValidationPipe());

  // Start the NestJS application
  await app.listen(process.env.PORT, () => {
    console.log(`Application is running on: http://localhost:${process.env.PORT}`);
  });
}

bootstrap();
