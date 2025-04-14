import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'url-shortener',
      brokers: [process.env.KAFKA_BROKER || 'kafka_deep:9092'],
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    await this.producer.connect();
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
    } catch (error) {
      throw new Error(
        `Failed to send message to topic ${topic}: ${error.message}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
