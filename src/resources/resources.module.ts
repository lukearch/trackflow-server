import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [UserModule, AuthModule, PlanModule]
})
export class ResourcesModule {}
