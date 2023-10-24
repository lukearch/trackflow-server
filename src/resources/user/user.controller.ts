import { Controller, Get, Param } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  public getAllUsers(): Promise<User[]> {
    return this.userService.users();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  public getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.user({
      id
    });
  }
}
