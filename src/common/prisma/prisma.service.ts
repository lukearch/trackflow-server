import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Scope
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({
  scope: Scope.DEFAULT
})
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    return this.$connect().then(() => {
      this.logger.log('Prisma Client connected with successfully');
    });
  }

  async onModuleDestroy() {
    return this.$disconnect().then(() => {
      this.logger.log('Prisma Client disconnected');
    });
  }
}
