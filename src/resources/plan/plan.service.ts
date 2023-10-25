import { PrismaService } from '@/common/prisma/prisma.service';
import { Calc } from '@/common/tools/calc.tool';
import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Plan } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlanDto): Promise<Plan> {
    await this.checkIfPlanAlreadyExists(data.name);

    return this.prisma.plan.create({
      data
    });
  }

  async plans(): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      include: {
        packages: true
      }
    });
  }

  async update(id: string, data: UpdatePlanDto): Promise<Plan> {
    await this.checkIfPlanAlreadyExists(data.name, id);

    return this.prisma.plan
      .update({
        where: {
          id
        },
        data: {
          ...data,
          ...(data.packages && {
            packages: {
              deleteMany: {},
              createMany: {
                data: data.packages?.map((p) => ({
                  ...p,
                  totalPrice: Calc.of(data.price)
                    .multiply(p.durationInMonths)
                    .subPercent(p.discount)
                    .finish()
                }))
              }
            }
          })
        },
        include: {
          packages: {
            select: {
              id: true,
              discount: true,
              durationInMonths: true,
              totalPrice: true
            }
          }
        }
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  private async checkIfPlanAlreadyExists(name: string, id?: string) {
    if (!name) return;

    const alreadyExist = await this.prisma.plan.findUnique({
      where: {
        name: name,
        NOT: {
          id
        }
      }
    });

    if (alreadyExist) throw new ConflictException();
  }
}
