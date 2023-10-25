import { Test, TestingModule } from '@nestjs/testing';
import { Plan } from '@prisma/client';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanService } from './plan.service';

describe('PlanService', () => {
  let service: PlanService;
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
              create: jest.fn(),
              findMany: jest.fn()
            }
          }
        }
      ]
    }).compile();

    service = module.get<PlanService>(PlanService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.plan.create with correct parameters', async () => {
      const createPlanDto = new CreatePlanDto({
        name: 'example'
      });

      const createSpy = jest
        .spyOn(prismaService.plan, 'create')
        .mockResolvedValueOnce(mockPlan);

      await service.create(createPlanDto);

      expect(createSpy).toHaveBeenCalledWith({ data: createPlanDto });
    });

    it('should return new plan', async () => {
      const createPlanDto = new CreatePlanDto({
        name: 'example'
      });

      const createSpy = jest
        .spyOn(prismaService.plan, 'create')
        .mockResolvedValueOnce(mockPlan);

      const result = await service.create(createPlanDto);

      expect(createSpy).toHaveBeenCalledWith({ data: createPlanDto });
      expect(result).toHaveProperty('name', createPlanDto.name);
      expect(result).toEqual(mockPlan);
    });
  });

  describe('plans', () => {
    it('should call prisma.plan.findMany', async () => {
      const findManySpy = jest
        .spyOn(prismaService.plan, 'findMany')
        .mockResolvedValueOnce([]);

      await service.plans();

      expect(findManySpy).toHaveBeenCalled();
    });
  });
});
