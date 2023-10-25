import { Body, Controller, Get, Post } from '@nestjs/common';
import { Plan, Role } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanService } from './plan.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../..//common/decorators/roles.decorator';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @Public()
  public getAllPlans(): Promise<Plan[]> {
    return this.planService.plans();
  }

  @Post()
  @Roles(Role.ADMIN)
  createPlan(@Body() dto: CreatePlanDto): Promise<Plan> {
    return this.planService.create(dto);
  }
}
