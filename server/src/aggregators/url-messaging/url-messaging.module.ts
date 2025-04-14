import { Module } from '@nestjs/common';
import { UrlMessagingAggregator } from './url-messaging.service';
import { KafkaModule } from '../../infrastructure/messaging/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [UrlMessagingAggregator],
  exports: [UrlMessagingAggregator],
})
export class UrlMessagingAggregatorModule {}
