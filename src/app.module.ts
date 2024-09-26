import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from './project/project.module';
import { PageModule } from './page/page.module';
import { ComponentModule } from './component/component.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JSXGeneratorModule } from './jsxgenerate/jsxgenerate.module';

import { PagegenerateModule } from './pagegenerate/pagegenerate.module';
//import { ReactAppService } from './react-app/react-app.service';

import { NetlifyDeployModule } from './deploy/deploy.module';



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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),  // Serve files from the 'uploads' directory
      serveRoot: '/uploads',  // Access these files via '/uploads' in the browser
    }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const secret = configService.get<string>('JWT_SECRET');
    //     console.log('JWT_SECRET:', secret); 
    //     return {
    //       secret,
    //       signOptions: { expiresIn: '60m' },
    //     };
    //   },
    // }),
     UserModule,
     AuthModule,
     ProjectModule,
     PageModule,
     ComponentModule,
     FileModule,
     JSXGeneratorModule,

     PagegenerateModule,
     NetlifyDeployModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
