import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      isGlobal: true
    })
  ],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class GlobalModule {}
