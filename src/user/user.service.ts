import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema/user.schema';

@Injectable()
// provider :it can be injected in def place  as dependencies
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
}
