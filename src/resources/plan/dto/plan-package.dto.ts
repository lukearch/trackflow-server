import { Prisma } from '@prisma/client';
import { IsNumber, Max, Min } from 'class-validator';

export class PlanPackageDto implements Prisma.PackageCreateInput {
  @Max(48)
  @Min(1)
  durationInMonths: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2
  })
  @Min(0)
  @Max(100)
  discount?: number;

  constructor(props: PlanPackageDto) {
    Object.assign(this, props);
  }
}
