import { Module } from '@nestjs/common';
import { ShortUrlDbAggregator } from './short-url.service';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShortUrlDbAggregator],
  exports: [ShortUrlDbAggregator],
})
export class ShortUrlDbAggregatorModule {}
