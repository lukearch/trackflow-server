import { Body, Controller, Post } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  createPlan(@Body() dto: CreatePlanDto): Promise<Plan> {
    return this.planService.create(dto);
  }
}
