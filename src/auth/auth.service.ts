import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
    )  {
        console.log('JwtService injected');
      }


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username); 
    if (user && user.password === pass) {//user exist and password matche
      const { password, ...result } = user; // Remove password 
      return result; //without the password
    }
    return null; //validation failed
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.userId }; 
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}