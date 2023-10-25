import { Injectable } from '@nestjs/common';
import { Plan } from '@prisma/client';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlanDto): Promise<Plan> {
    return this.prisma.plan.create({
      data
    });
  }

  async plans(): Promise<Plan[]> {
    return this.prisma.plan.findMany();
  }
}
