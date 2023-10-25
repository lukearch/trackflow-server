import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public authenticateUser(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('register')
  public registerUser(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
