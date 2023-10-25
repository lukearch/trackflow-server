import { PrismaService } from '@/common/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

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

    return this.prisma.user.create({
      data: {
        ...data,
        plan: {
          connectOrCreate: {
            create: {
              name: 'Gratuito'
            },
            where: {
              name: 'Gratuito'
            }
          }
        }
      }
    });
  }
}
