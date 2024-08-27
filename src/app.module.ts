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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
