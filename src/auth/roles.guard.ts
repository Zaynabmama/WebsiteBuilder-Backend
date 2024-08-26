import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return user.role === 'admin';
  }
}