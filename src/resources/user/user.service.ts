import { Injectable, NotFoundException } from '@nestjs/common';
import { Plan, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../global/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where,
      include: {
        plan: true
      }
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const freePlan: Plan = await this.prisma.plan
      .findFirstOrThrow({
        where: {
          name: 'gratuito'
        }
      })
      .catch(
        async () =>
          await this.prisma.plan.create({
            data: {
              name: 'gratuito'
            }
          })
      );

    return this.prisma.user.create({
      data: {
        ...data,
        plan: {
          connect: {
            id: freePlan.id
          }
        }
      }
    });
  }
}
