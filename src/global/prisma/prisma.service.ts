import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { ChildProcess, exec } from 'child_process';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  @Inject()
  private configService: ConfigService;

  private readonly logger = new Logger(PrismaService.name);
  private studio?: ChildProcess;

  onModuleInit() {
    this.$connect()
      .then(() => {
        this.logger.log('Prisma Client connected with successfully');

        this.studio = exec(
          `npx prisma studio --port=${this.configService.get(
            'PRISMA_STUDIO_PORT'
          )} --browser none`
        );

        this.studio.stdout.on('data', (data: string) => {
          Logger.log(data.trim(), 'PrismaStudio');
        });

        this.studio.stderr.on('data', (data: string) => {
          Logger.error(data.trim(), 'PrismaStudio');
        });
      })
      .catch((err) => {
        this.logger.error(err.message);

        if (this.studio) {
          this.studio.disconnect();
        }
      });
  }

  onModuleDestroy() {
    this.$disconnect().then(() => {
      this.logger.log('Prisma Client disconencted');
      this.studio.disconnect();
    });
  }
}
