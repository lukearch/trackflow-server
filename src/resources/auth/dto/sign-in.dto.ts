import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({
    message: 'email is missing'
  })
  email: string;

  @IsNotEmpty({
    message: 'password is missing'
  })
  password: string;
}
