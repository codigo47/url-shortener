import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

export type MessageHandler = (topic: string, payload: any) => Promise<void>;

export interface TopicConfig {
  topics: string[];
}

export interface MessageHandlerConfig {
  handleMessage: MessageHandler;
}

export interface KafkaConsumerConfig
  extends TopicConfig,
    MessageHandlerConfig {}

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private config: KafkaConsumerConfig;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'url-shortener',
      brokers: [process.env.KAFKA_BROKER || 'kafka_deep:9092'],
    });

    this.consumer = this.kafka.consumer({ groupId: 'url-shortener-group' });
  }

  async onModuleInit() {
    if (this.config) {
      await this.connect(this.config);
    }
  }

  async configure(config: KafkaConsumerConfig) {
    this.config = config;
    if (this.consumer) {
      await this.connect(config);
    }
  }

  async connect({ topics, handleMessage }: KafkaConsumerConfig) {
    await this.consumer.connect();
    await this.subscribeToTopics(topics);
    await this.startMessageConsumption({ handleMessage });
  }

  private async subscribeToTopics(topics: string[]) {
    for (const topic of topics) {
      await this.consumer.subscribe({
        topic,
        fromBeginning: true,
      });
    }
  }

  private async startMessageConsumption({
    handleMessage,
  }: MessageHandlerConfig) {
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString();
        if (!value) return;

        const payload = JSON.parse(value);
        await handleMessage(topic, payload);
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
