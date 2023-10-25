import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from 'class-validator';
import { PlanPackageDto } from './plan-package.dto';

export class UpdatePlanDto implements Prisma.PlanUpdateWithoutPackagesInput {
  @IsOptional()
  @Type(() => String)
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2
  })
  @Min(0)
  price?: number = 0;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Type(() => String)
  description?: string;

  @IsOptional()
  @ValidateNested({
    each: true
  })
  @Type(() => PlanPackageDto)
  packages?: PlanPackageDto[];

  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0
  })
  @Min(0)
  maxEvents?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalFeatures?: string[];

  constructor(props: UpdatePlanDto) {
    Object.assign(this, props);
  }
}
