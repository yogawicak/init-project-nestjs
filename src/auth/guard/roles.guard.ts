import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IUserDecoded } from 'src/common/UserDecoded';
import { ROLE } from 'src/user/entities/user.role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const hasRolesPermission = this.reflector.get<ROLE[]>(
      'role',
      context.getHandler(),
    );
    const roleUser = context.switchToHttp().getRequest<IUserDecoded>()
      .user.role;

    console.log(hasRolesPermission, roleUser);

    if (!hasRolesPermission.includes(roleUser)) {
      throw new ForbiddenException(`Forbidden For Role ${roleUser}`);
    }

    return true;
  }
}
