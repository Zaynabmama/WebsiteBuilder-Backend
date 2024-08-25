import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {} 


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username); 
    if (user && user.password === pass) {//user exist and password matche
      const { password, ...result } = user; // Remove password 
      return result; //without the password
    }
    return null; //validation failed
  }


}