import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { IRequest } from '@/common/interfaces/custom-request.interface';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<IRequest>();
    const token = this.extractTokenFromRequest(request);

    if (!token)
      throw new BadRequestException('provided token must be a Bearer Token');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('SECRET')
      });

      request.setContext('user', payload);
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromRequest(request: IRequest): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'access token must be provided to access this resource'
      );
    }

    const [type, token] = request.headers.authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
