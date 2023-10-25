import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      jest.spyOn(userService, 'users').mockResolvedValueOnce([]);

      const result = await userController.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should search user when id parameter is provided', async () => {
      const id = 'valid_id';

      const userSpy = jest
        .spyOn(userService, 'user')
        .mockResolvedValueOnce({ id: 'valid_id' } as User);

      const result = await userController.getUserById(id);

      expect(userSpy).toHaveBeenCalledWith({ id });
      expect(result).toHaveProperty('id', 'valid_id');
    });
  });

  describe('getProfile', () => {
    it('should return information for authenticated user', async () => {
      const id = 'valid_id';

      const mockRequest = {
        getContext: jest.fn()
      };

      const getContextSpy = jest
        .spyOn(mockRequest, 'getContext')
        .mockReturnValueOnce({
          sub: id
        });

      const userSpy = jest.spyOn(userService, 'user').mockResolvedValue({
        id
      } as User);

      const result = await userController.getProfile(mockRequest as any);

      expect(getContextSpy).toHaveBeenCalledWith('user');
      expect(userSpy).toBeCalledWith({
        id
      });
      expect(result).toHaveProperty('id', id);
    });
  });
});
