import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { GlobalModule } from './global/global.module';
import { ResourcesModule } from './resources/resources.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { IgnorePropertiesInterceptor } from './common/interceptors/ignore-properties.interceptor';

@Module({
  imports: [
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
    GlobalModule,
    ResourcesModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IgnorePropertiesInterceptor
    }
  ],
  controllers: [AppController]
})
export class AppModule {}
