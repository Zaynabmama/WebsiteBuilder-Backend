import { Injectable } from '@nestjs/common';

@Injectable()
export class PageService {
    constructor(

        @InjectModel(User.name) private userModel: Model<User>,
      ) {}
}
