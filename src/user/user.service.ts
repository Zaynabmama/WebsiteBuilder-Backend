import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema/user.schema';
import * as bcrypt from 'bcrypt';


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
    const salt = await bcrypt.genSalt(); 
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt); 
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword, 
    });
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
