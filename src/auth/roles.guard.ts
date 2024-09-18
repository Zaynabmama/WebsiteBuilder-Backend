import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    console.log('User object in RolesGuard:', user);  // Debugging log

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Forbidden resource'); // Throw 403 if not an admin
    }
    
    return true; // Allow access if the user is an admin
  }
}
//     return user.role === 'admin';
//   }
// }