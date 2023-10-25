import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { PrismaService } from './common/prisma/prisma.service';
import { ResourcesModule } from './resources/resources.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('SECRET'),
        signOptions: {
          expiresIn: '30d'
        }
      })
    }),
    ResourcesModule
  ],
  providers: [PrismaService],
  controllers: [AppController],
  exports: [PrismaService]
})
export class AppModule {}
