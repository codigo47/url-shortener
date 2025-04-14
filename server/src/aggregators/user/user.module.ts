import { Module } from '@nestjs/common';
import { UserAggregator } from './user.service';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserAggregator],
  exports: [UserAggregator],
})
export class UserAggregatorModule {}
