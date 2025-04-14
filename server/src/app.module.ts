import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphqlAppModule } from './apps/graphql/graphql.module';
import { MessagingAppModule } from './apps/messaging/messaging.module';
import { ScheduledJobsModule } from './apps/jobs/scheduled-jobs.module';
import { RestApiModule } from './apps/rest-api/rest-api.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Time window in seconds
        limit: 10, // Maximum number of requests within the TTL
      },
    ]),
    GraphqlAppModule,
    MessagingAppModule,
    ScheduledJobsModule,
    RestApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
