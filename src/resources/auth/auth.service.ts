import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/resources/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.user({
      email
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    const payload = this.extractPayload(user);

    return {
      token: await this.jwtService.signAsync(payload)
    };
  }

  async register(customer: RegisterDto) {
    const user = await this.userService.createUser({
      ...customer,
      password: await bcrypt.hash(customer.password, bcrypt.genSaltSync(10))
    });

    const payload = this.extractPayload(user);

    return {
      token: await this.jwtService.signAsync(payload)
    };
  }

  private extractPayload(user: User) {
    return { sub: user.id, email: user.email, role: user.role };
  }
}
