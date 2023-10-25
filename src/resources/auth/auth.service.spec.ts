import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../global/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  let mockUser: {
    id: string;
    email: string;
    password: string;
    role: Role;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, PrismaService]
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);

    mockUser = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      role: Role.USER
    };
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token for valid credentials', async () => {
      jest.spyOn<any, any>(userService, 'user').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('mockToken');

      const result = await authService.signIn('test@example.com', 'password');

      expect(result).toHaveProperty('token', 'mockToken');
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      jest.spyOn<any, any>(userService, 'user').mockResolvedValueOnce(mockUser);
      jest.spyOn<any, any>(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(
        authService.signIn('test@example.com', 'password')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return a token for a new user', async () => {
      jest
        .spyOn<any, any>(userService, 'createUser')
        .mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('mockToken');

      const result = await authService.register({
        email: 'text@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password'
      });

      expect(result).toHaveProperty('token', 'mockToken');
    });
  });
});
