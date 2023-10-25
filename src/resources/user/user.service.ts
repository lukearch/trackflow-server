import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
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
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (user) throw new ConflictException();

    const freePlan: Plan = await this.prisma.plan
      .findUnique({
        where: {
          name: 'gratuito'
        }
      })
      .then(async (plan) => {
        return plan
          ? plan
          : await this.prisma.plan.create({
              data: {
                name: 'gratuito'
              }
            });
      });

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
