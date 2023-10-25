import { Prisma } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword
} from 'class-validator';

export class RegisterDto implements Prisma.UserCreateInput {
  @IsEmail(
    {},
    {
      message: 'email must be valid'
    }
  )
  email: string;

  @IsNotEmpty({
    message: 'first name is missing'
  })
  firstName: string;

  @IsNotEmpty({
    message: 'last name is missing'
  })
  lastName: string;

  @IsOptional()
  @IsPhoneNumber('BR', {
    message: 'phone must be valid'
  })
  phone?: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1
  })
  password: string;

  constructor(customer: RegisterDto) {
    Object.assign(this, customer);
  }
}
