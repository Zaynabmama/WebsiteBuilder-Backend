import * as dotenv from 'dotenv';
dotenv.config(); 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Nest application is starting...');
  await app.listen(process.env.PORT , () => {
    console.log(`Application is running on: http://localhost:${process.env.PORT }`);
  });
}
bootstrap();
