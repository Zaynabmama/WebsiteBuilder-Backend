import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema/user.schema';

@Injectable()
export class PageService {
    constructor(

        @InjectModel(User.name) private userModel: Model<User>,
      ) {}
}
