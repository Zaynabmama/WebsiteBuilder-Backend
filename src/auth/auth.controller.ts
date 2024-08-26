import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        ) {}
    @Post('login')
    async login(@Body() body: { name: string; password: string }) {
        const user = await this.authService.validateUser(body.name, body.password);
        if (!user) {
            throw new BadRequestException('Invalid credentialls'); 
        }
        return this.authService.login(user); 
    
  }
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    const token = await this.authService.login(user); 
    return { message: 'User registered successfully', token };
  }
  }
