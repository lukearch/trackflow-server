import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePlanDto implements Prisma.PlanCreateInput {
  @IsNotEmpty({
    message: 'name is missing'
  })
  name: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  duration?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  features?: string[];

  @IsOptional()
  additionalFeatures?: string[];

  @IsOptional()
  active?: boolean;

  @IsOptional()
  maxEvents?: number;

  constructor(customer: CreatePlanDto) {
    Object.assign(this, customer);
  }
}
