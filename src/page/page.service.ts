import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PageService {
    constructor(

        @InjectModel(User.name) private userModel: Model<User>,
      ) {}
}
