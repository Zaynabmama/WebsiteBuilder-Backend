import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
    )  {
        console.log('JwtService injected');
      }


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email); 
    if (user && await bcrypt.compare(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      throw new BadRequestException('Invalid credentials');
    }
   
      async login(user: any) {
        const payload = { email: user.email, sub: user.userId }; 
        console.log('JWT Secret in AuthService:', this.jwtService['options']?.secret);  // Log the secret being used
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      
    };
  