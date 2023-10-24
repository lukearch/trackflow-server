import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect()
      .then(() => {
        this.logger.log('Prisma Client connected with successfully');
      })
      .catch((err) => {
        this.logger.error(err.message);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect().then(() => {
      this.logger.log('Prisma Client disconnected');
    });
  }
}
