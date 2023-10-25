import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn()
          }
        }
      ]
    }).compile();

    guard = module.get(RolesGuard);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(reflector).toBeDefined();
  });

  it('should always allow access if resource is public', () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          getContext: jest.fn(() => {
            return { role: Role.USER };
          })
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest.spyOn(guard, 'isPublic').mockReturnValueOnce(true);
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.ADMIN]);

    const result = guard.canActivate(mockContext as any);

    expect(result).toBeTruthy();
  });

  it('should continue performing role validation when resource is not public', () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          getContext: jest.fn(() => {
            return { role: Role.USER };
          })
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(undefined);
    const extractRequiredRolesSpy = jest.spyOn(guard, 'extractRequiredRoles');

    guard.canActivate(mockContext as any);

    expect(extractRequiredRolesSpy).toHaveBeenCalled();
  });

  it('should allow access with valid role', () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          getContext: jest.fn(() => {
            return { role: Role.USER };
          })
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce([Role.USER]);

    expect(guard.canActivate(mockContext as any)).toBeTruthy();
  });

  it('should always allow access if user role is Role.ADMIN', () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          getContext: jest.fn(() => {
            return { role: Role.ADMIN };
          })
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest.spyOn(guard, 'isPublic').mockReturnValueOnce(false);

    const requiredRolesSpy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.USER]);

    const result = guard.canActivate(mockContext as any);

    expect(requiredRolesSpy).toHaveBeenCalledWith(ROLES_KEY, [
      mockContext.getHandler(),
      mockContext.getClass()
    ]);

    expect(result).toBeTruthy();
  });

  it('should return false when provided role does not match any resource required roles', () => {
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          getContext: jest.fn(() => {
            return { role: Role.USER };
          })
        }))
      })),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };

    jest.spyOn(guard, 'isPublic').mockReturnValueOnce(false);
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.ADMIN]);

    const result = guard.canActivate(mockContext as any);

    expect(result).toBeFalsy();
  });
});
