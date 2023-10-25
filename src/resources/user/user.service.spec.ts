import { PrismaService } from '@/common/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Role, User } from '@prisma/client';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      planId: '1',
      phone: null,
      password: 'password',
      role: Role.USER,
      planExpiresIn: new Date()
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn()
            }
          }
        }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('user', () => {
    it('should call prismaService.user.findUnique', async () => {
      const uniqueKeys: Prisma.UserWhereUniqueInput = {
        id: '1'
      };

      const findUniqueSpy = jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue({} as User);

      await userService.user(uniqueKeys);

      expect(findUniqueSpy).toBeCalledWith({
        where: uniqueKeys,
        include: { plan: true }
      });
    });

    it('should throw a NotFoundException when attempt to find a non-existent user', () => {
      const uniqueKeys: Prisma.UserWhereUniqueInput = {
        id: 'invalid_id'
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(undefined);

      expect(userService.user(uniqueKeys)).rejects.toThrow(NotFoundException);
    });

    it('should return user when provides a valid unique key', async () => {
      const uniqueKeys: Prisma.UserWhereUniqueInput = {
        id: '1'
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUsers.find((u) => u.id === uniqueKeys.id));

      const result = await userService.user(uniqueKeys);

      expect(result).toHaveProperty('firstName', 'John');
      expect(result).toHaveProperty('lastName', 'Doe');
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValueOnce(mockUsers);

      const result = await userService.users();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should throw a ConflicException if already exists an user with provided email', () => {
      const user: Prisma.UserCreateInput = {
        email: 'user1@example.com',
        firstName: 'Luke',
        lastName: 'Skywalker',
        password: 'r2d2'
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce({} as User);

      expect(userService.createUser(user)).rejects.toThrow(ConflictException);
    });

    it('should create a new user and connect to free default free plan', async () => {
      const user: Prisma.UserCreateInput = {
        email: 'test@example.com',
        firstName: 'Luke',
        lastName: 'Skywalker',
        password: 'r2d2'
      };

      const createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce({ ...user, id: '4' } as User);

      const result = await userService.createUser(user);

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          ...user,
          plan: {
            connectOrCreate: {
              create: {
                name: 'Gratuito'
              },
              where: {
                name: 'Gratuito'
              }
            }
          }
        }
      });

      expect(result).toHaveProperty('id', '4');
    });
  });
});
