import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let app: NestExpressApplication;
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile();

    app = module.createNestApplication();
    service = app.get(PrismaService);
  });

  afterEach(async () => app.close());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to Prisma', async () => {
    const connectSpy = jest.spyOn(service, '$connect');
    await service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should disconnect from Prisma', async () => {
    const disconnectSpy = jest.spyOn(service, '$disconnect');
    await service.onModuleDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
