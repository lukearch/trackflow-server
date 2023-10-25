import { Test, TestingModule } from '@nestjs/testing';
import { Plan } from '@prisma/client';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanService } from './plan.service';
import { ConflictException } from '@nestjs/common';

describe('PlanService', () => {
  let authService: PlanService;
  let prismaService: PrismaService;

  const mockPlan: Plan = {
    name: 'example',
    id: '1',
    active: true,
    additionalFeatures: [],
    features: [],
    maxEvents: 2500,
    description: null,
    duration: null,
    price: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: PrismaService,
          useValue: {
            plan: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn()
            }
          }
        }
      ]
    }).compile();

    authService = module.get<PlanService>(PlanService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.plan.create with correct parameters', async () => {
      const createPlanDto = new CreatePlanDto({
        name: 'example'
      });

      const createSpy = jest
        .spyOn(prismaService.plan, 'create')
        .mockResolvedValueOnce(mockPlan);

      await authService.create(createPlanDto);

      expect(createSpy).toHaveBeenCalledWith({ data: createPlanDto });
    });

    it('should throw a ConflictException when provided plan name equals existing plan name', async () => {
      const createPlanDto = new CreatePlanDto({
        name: 'example'
      });

      jest
        .spyOn(prismaService.plan, 'findUnique')
        .mockResolvedValueOnce(mockPlan);

      expect(authService.create(createPlanDto)).rejects.toThrow(
        ConflictException
      );
    });

    it('should return new plan', async () => {
      const createPlanDto = new CreatePlanDto({
        name: 'example'
      });

      jest.spyOn(prismaService.plan, 'create').mockResolvedValueOnce(mockPlan);

      const result = await authService.create(createPlanDto);

      expect(result).toHaveProperty('name', createPlanDto.name);
    });
  });

  describe('plans', () => {
    it('should call prisma.plan.findMany', async () => {
      const findManySpy = jest
        .spyOn(prismaService.plan, 'findMany')
        .mockResolvedValueOnce([]);

      await authService.plans();

      expect(findManySpy).toHaveBeenCalled();
    });
  });
});
