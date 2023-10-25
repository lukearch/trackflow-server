import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        JwtService,
        ConfigService,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn()
          }
        }
      ]
    }).compile();

    guard = module.get(AuthGuard);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should always allow access when resource is public', () => {
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);

    const result = guard.canActivate(mockContext as any);

    expect(result).toBeTruthy();
  });

  it('should allow access with valid token', async () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          headers: {
            authorization: 'Bearer valid_token'
          },
          setContext: jest.fn()
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({});
    jest.spyOn(configService, 'get').mockReturnValueOnce('secret');

    const result = await guard.canActivate(mockContext as any);

    expect(result).toBeTruthy();
  });

  it('should throw UnauthorizedException if not logged in', async () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          headers: {}
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('should throw UnauthorizedException if token is not a Bearer Token', async () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          headers: {
            authorization: 'not_bearer_token'
          }
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
      BadRequestException
    );
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          headers: {
            authorization: 'Bearer invalid_token'
          }
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValueOnce(new Error('Invalid token'));

    jest.spyOn(configService, 'get').mockReturnValueOnce('secret');

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
