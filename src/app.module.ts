import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
     // MongooseModule.forRoot('mongodb://localhost:27017/website-builder'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_URL');
        console.log('Connecting to MongoDB:', uri);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
     UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
