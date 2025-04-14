import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthSystem } from './auth.service';
import { UserAggregatorModule } from '../../aggregators/user/user.module';

@Module({
  imports: [
    UserAggregatorModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthSystem],
  exports: [AuthSystem],
})
export class AuthSystemModule {}
