import { ConflictException, Injectable } from '@nestjs/common';
import { Plan } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlanDto): Promise<Plan> {
    const alreadyExist = await this.prisma.plan.findUnique({
      where: {
        name: data.name
      }
    });

    if (alreadyExist) throw new ConflictException();

    return this.prisma.plan.create({
      data
    });
  }

  async plans(): Promise<Plan[]> {
    return this.prisma.plan.findMany();
  }
}
