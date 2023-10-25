import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IRequest } from '../interfaces/custom-request.interface';
import { DecodedUserToken } from '../interfaces/decoded-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const requiredRoles = this.extractRequiredRoles(context);

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<IRequest>();
    const role = request.getContext<DecodedUserToken>('user').role;

    if (role === Role.ADMIN || requiredRoles.includes(role)) return true;

    return false;
  }

  isPublic(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<Role[]>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;

    return false;
  }

  extractRequiredRoles(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
  }
}
