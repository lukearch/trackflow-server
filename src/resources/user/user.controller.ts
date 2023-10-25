import { Controller, Get, Param, Req } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Ignore } from '@/common/decorators/ignore.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { IRequest } from '@/common/interfaces/custom-request.interface';
import { DecodedUserToken } from '@/common/interfaces/decoded-user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  public getAllUsers(): Promise<User[]> {
    return this.userService.users();
  }

  @Get('find/:id')
  @Roles(Role.ADMIN)
  @Ignore('password')
  public getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.user({
      id
    });
  }

  @Get('me')
  @Ignore('password', 'role', 'plan.id', 'id', 'planId')
  public getProfile(@Req() request: IRequest): Promise<User> {
    return this.userService.user({
      id: request.getContext<DecodedUserToken>('user').sub
    });
  }
}
