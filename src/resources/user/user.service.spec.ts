import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Plan, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  let mockPlans: Plan[] = [];

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
              findUnique: jest.fn((props: Prisma.UserDeleteArgs) => {
                return (
                  mockUsers.find((user) => {
                    if (
                      user.id === props.where.id ||
                      user.email === props.where.email
                    )
                      return user;
                  }) || null
                );
              }),
              findMany: jest.fn(() => mockUsers),
              create: jest.fn()
            },
            plan: {
              create: jest.fn((props: Prisma.PlanCreateArgs) => {
                const basePlan = {
                  id: '1',
                  name: null,
                  active: false,
                  description: null,
                  additionalFeatures: [],
                  features: [],
                  duration: null,
                  maxEvents: 2500,
                  price: null
                };

                Object.assign(basePlan, props.data);

                mockPlans.push(basePlan);

                return basePlan as Plan;
              }),
              findUnique: jest.fn()
            }
          }
        }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get(PrismaService);
    mockPlans = [];
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('user', () => {
    it('should call prismaService.user.findUnique', async () => {
      const uniqueKeys: Prisma.UserWhereUniqueInput = {
        id: '1'
      };

      const findUniqueSpy = jest.spyOn(prismaService.user, 'findUnique');

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

      expect(userService.user(uniqueKeys)).rejects.toThrow(NotFoundException);
    });

    it('should return user when provides a valid unique key', async () => {
      const uniqueKeys: Prisma.UserWhereUniqueInput = {
        id: '1'
      };

      const result = await userService.user(uniqueKeys);

      expect(result).toHaveProperty('firstName', 'John');
      expect(result).toHaveProperty('lastName', 'Doe');
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
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

      expect(userService.createUser(user)).rejects.toThrow(ConflictException);
    });

    it('should create an user with current existing free plan', async () => {
      const user: Prisma.UserCreateInput = {
        email: 'test@example.com',
        firstName: 'Luke',
        lastName: 'Skywalker',
        password: 'r2d2'
      };

      const findUniqueSpy = jest
        .spyOn(prismaService.plan, 'findUnique')
        .mockResolvedValueOnce({
          name: 'gratuito',
          id: '1'
        } as Plan);

      await userService.createUser(user);

      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: {
          name: 'gratuito'
        }
      });
    });

    it('should create a new free plan called "gratuito" when it does not exist', async () => {
      const user: Prisma.UserCreateInput = {
        email: 'test@example.com',
        firstName: 'Luke',
        lastName: 'Skywalker',
        password: 'r2d2'
      };

      jest.spyOn(prismaService.plan, 'findUnique').mockResolvedValueOnce(null);

      const createSpy = jest.spyOn(prismaService.plan, 'create');

      await userService.createUser(user);

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          name: 'gratuito'
        }
      });

      expect(mockPlans).toHaveLength(1);
      expect(mockPlans.shift()).toHaveProperty('id', '1');
    });

    it('should create a new user', async () => {
      const user: Prisma.UserCreateInput = {
        email: 'test@example.com',
        firstName: 'Luke',
        lastName: 'Skywalker',
        password: 'r2d2'
      };

      jest.spyOn(prismaService.plan, 'findUnique').mockResolvedValueOnce(null);

      const createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce({ ...user, id: '4' } as User);

      const result = await userService.createUser(user);

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          ...user,
          plan: {
            connect: {
              id: '1'
            }
          }
        }
      });

      expect(result).toHaveProperty('id', '4');
    });
  });
});
