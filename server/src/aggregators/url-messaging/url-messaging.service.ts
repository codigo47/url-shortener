import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '../../infrastructure/messaging/kafka-producer.service';
import { KafkaConsumerService } from '../../infrastructure/messaging/kafka-consumer.service';
import { MessageHandler } from '../../infrastructure/messaging/kafka-consumer.service';
import {
  UrlCreatedMessageDto,
  UrlVisitedMessageDto,
} from './dto/url-message.dto';

@Injectable()
export class UrlMessagingAggregator {
  constructor(
    private readonly producer: KafkaProducerService,
    private readonly consumer: KafkaConsumerService,
  ) {}

  async configureMessaging(
    topics: string[],
    handleMessage: MessageHandler,
  ): Promise<void> {
    await this.consumer.configure({
      topics,
      handleMessage,
    });
  }

  async sendUrlCreatedMessage(payload: UrlCreatedMessageDto): Promise<void> {
    await this.producer.sendMessage('url.created', payload);
  }

  async sendUrlVisitedMessage(payload: UrlVisitedMessageDto): Promise<void> {
    await this.producer.sendMessage('url.visited', payload);
  }
}
