import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:User.name,schema: UserSchema}]),// Registering the UserSchema with Mongoose
],


  controllers: [UserController],//api endpoints
  providers: [UserService],//business logic for users
  exports: [UserService]
})
export class UserModule {}
