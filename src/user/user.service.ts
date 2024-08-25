import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema/user.schema';

@Injectable()
// provider :it can be injected in def place  as dependencies
export class UserService {
  
  
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    console.log('UserModel has been injected');
  }
  async findOne(name: string): Promise<User | null> {
    return this.userModel.findOne({ name });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
  }
  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    return user;
  }
  async findAllUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }
  async deleteUser(userId: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    return deletedUser;
  }
}
