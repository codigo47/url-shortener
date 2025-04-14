import { Module } from '@nestjs/common';
import { MessagingApp } from './messaging.service';
import { ShortUrlSystemModule } from '../../systems/short-url/short-url.module';

@Module({
  imports: [ShortUrlSystemModule],
  providers: [MessagingApp],
  exports: [MessagingApp],
})
export class MessagingAppModule {}
