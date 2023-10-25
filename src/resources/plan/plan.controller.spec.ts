import { Test, TestingModule } from '@nestjs/testing';
import { Plan } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

describe('PlanController', () => {
  let planController: PlanController;
  let planService: PlanService;

  const mockPlans: Plan[] = [
    {
      name: 'plan 1',
      id: '1',
      active: true,
      additionalFeatures: [],
      features: [],
      maxEvents: 2500,
      description: null,
      price: null
    },
    {
      name: 'plan 2',
      id: '2',
      active: true,
      additionalFeatures: [],
      features: [],
      maxEvents: 2500,
      description: null,
      price: null
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
      providers: [PlanService, PrismaService]
    }).compile();

    planController = module.get(PlanController);
    planService = module.get(PlanService);
  });

  it('should be defined', () => {
    expect(planController).toBeDefined();
  });

  describe('getAllPlans', () => {
    it('should call planService.plans', async () => {
      const plansSpy = jest
        .spyOn(planService, 'plans')
        .mockResolvedValueOnce(mockPlans);

      await planController.getAllPlans();

      expect(plansSpy).toHaveBeenCalled();
    });

    it('should return an array of plans', async () => {
      jest.spyOn(planService, 'plans').mockResolvedValueOnce(mockPlans);

      const result = await planController.getAllPlans();

      expect(result).toEqual(mockPlans);
    });
  });

  describe('createPlan', () => {
    it('should call planService.create with correct parameters', async () => {
      const createPlanDto = new CreatePlanDto({
        name: 'example'
      });

      const createSpy = jest
        .spyOn(planService, 'create')
        .mockResolvedValueOnce({ name: 'example' } as Plan);

      await planController.createPlan(createPlanDto);

      expect(createSpy).toHaveBeenCalledWith(createPlanDto);
    });

    it('should create a new plan', async () => {
      const createPlanDto = new CreatePlanDto({
        name: 'example'
      });

      jest
        .spyOn(planService, 'create')
        .mockResolvedValueOnce({ name: 'example' } as Plan);

      const result = await planController.createPlan(createPlanDto);

      expect(result).toHaveProperty('name', 'example');
    });
  });
});
