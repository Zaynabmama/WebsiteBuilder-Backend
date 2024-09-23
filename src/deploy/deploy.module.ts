import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { User, UserSchema } from 'src/user/schemas/user.schema/user.schema';
import { NetlifyDeployController } from './deploy.controller';
import { NetlifyDeployService } from './deploy.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule, 
  ],
  controllers: [NetlifyDeployController],
  providers: [NetlifyDeployService], 
})
export class NetlifyDeployModule {}
