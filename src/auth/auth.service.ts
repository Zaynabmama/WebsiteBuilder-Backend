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
        const { password, ...result } = user.toObject();
        return result;
      }
      throw new BadRequestException('Invalid credentials');
    }
   
    //   async login(user: any) {
    //     const payload = { email: user.email, sub: user.userId ,role: user.role }; 
    //     console.log('JWT Secret in AuthService:', this.jwtService['options']?.secret); 
    //     return {
    //       access_token: this.jwtService.sign(payload),
    //     };
    //   }
    async login(user: any) {
        const payload = { email: user.email, sub: user._id, role: user.role,name:user.name };
        console.log('JWT Payload:', payload);
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
        };
      }
      
    };
  