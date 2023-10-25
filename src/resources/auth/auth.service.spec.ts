import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserService } from '@/resources/user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let mockUser: User;

  beforeAll(async () => {
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
    } as User;
  });

  describe('signIn', () => {
    let userServiceMock: jest.SpyInstance;
    let jwtServiceMock: jest.SpyInstance;

    beforeEach(() => {
      userServiceMock = jest.spyOn(userService, 'user');
      jwtServiceMock = jest.spyOn(jwtService, 'signAsync');
    });

    it('should return a token for valid credentials', async () => {
      userServiceMock.mockResolvedValueOnce(mockUser);
      jwtServiceMock.mockResolvedValueOnce('mockToken');

      const result = await authService.signIn('test@example.com', 'password');

      expect(result).toHaveProperty('token', 'mockToken');
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      userServiceMock.mockResolvedValueOnce(mockUser);
      jest.spyOn<any, any>(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(
        authService.signIn('test@example.com', 'password')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    let userServiceMock: jest.SpyInstance;
    let jwtServiceMock: jest.SpyInstance;

    beforeEach(() => {
      userServiceMock = jest.spyOn(userService, 'createUser');
      jwtServiceMock = jest.spyOn(jwtService, 'signAsync');
    });

    it('should return a token for a new user', async () => {
      userServiceMock.mockResolvedValueOnce(mockUser);
      jwtServiceMock.mockResolvedValueOnce('mockToken');

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
