import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:'user',schema: UserSchema}]),// Registering the UserSchema with Mongoose
],


  controllers: [UserController],//api endpoints
  providers: [UserService],//business logic for users
})
export class UserModule {}
