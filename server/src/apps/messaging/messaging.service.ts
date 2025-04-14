import { Injectable, OnModuleInit } from '@nestjs/common';
import { ShortUrlSystem } from '../../systems/short-url/short-url.service';
import { UrlCreatedMessageDto } from './dto/url-created-message.dto';
import { UrlVisitedMessageDto } from './dto/url-visited-message.dto';
import { URL_TOPICS } from './url-topics';

@Injectable()
export class MessagingApp implements OnModuleInit {
  constructor(private readonly urlSystem: ShortUrlSystem) {}

  async onModuleInit() {
    await this.urlSystem.configureMessaging(this.getTopics());
  }

  getTopics(): string[] {
    return Object.values(URL_TOPICS);
  }

  async handleMessage(topic: string, payload: any): Promise<void> {
    switch (topic) {
      case URL_TOPICS.CREATED:
        await this.urlSystem.handleUrlCreated(payload as UrlCreatedMessageDto);
        break;
      case URL_TOPICS.VISITED:
        await this.urlSystem.handleUrlVisited(payload as UrlVisitedMessageDto);
        break;
      default:
        console.warn(`No handler found for topic: ${topic}`);
    }
  }
}
