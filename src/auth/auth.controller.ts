import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    async login(@Body() body: { name: string; password: string }) {
        const user = await this.authService.validateUser(body.name, body.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user); 
  }
  }
