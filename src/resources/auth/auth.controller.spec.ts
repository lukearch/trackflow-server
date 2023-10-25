import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../global/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService, JwtService, PrismaService]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('authenticateUser', () => {
    it('should call authService.signIn with correct parameters', async () => {
      const signInDto = new SignInDto({
        email: 'test@example.com',
        password: 'password'
      });

      const signInSpy = jest
        .spyOn(authService, 'signIn')
        .mockResolvedValueOnce({
          token: 'mockToken'
        });

      await authController.authenticateUser(signInDto);

      expect(signInSpy).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('should return the result from authService.signIn', async () => {
      const signInDto = new SignInDto({
        email: 'test@example.com',
        password: 'password'
      });

      jest.spyOn(authService, 'signIn').mockResolvedValueOnce({
        token: 'mockToken'
      });

      const result = await authController.authenticateUser(signInDto);

      expect(result).toEqual({ token: 'mockToken' });
    });
  });

  describe('registerUser', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerDto = new RegisterDto({
        email: 'text@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password'
      });

      const registerSpy = jest
        .spyOn(authService, 'register')
        .mockResolvedValueOnce({ token: 'mockToken' });

      await authController.registerUser(registerDto);

      expect(registerSpy).toHaveBeenCalledWith(registerDto);
    });

    it('should create a new user', async () => {
      const registerDto = new RegisterDto({
        email: 'text@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password'
      });

      jest.spyOn(authService, 'register').mockResolvedValueOnce({
        token: 'mockToken'
      });

      const result = await authController.registerUser(registerDto);

      expect(result).toEqual({
        token: 'mockToken'
      });
    });
  });
});
