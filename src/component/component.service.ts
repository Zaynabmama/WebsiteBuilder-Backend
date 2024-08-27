import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ComponentService {
constructor(
    @InjectModel(User.name) private userModel: Model<User>,// injects the Mongoose model associated with the User schema to interact with the User collection in MongoDB
  ) {}
}