import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledJobsApp } from './scheduled-jobs.service';
import { SlugGeneratorModule } from '../../systems/slug-generator.ts/slug-generator.module';

@Module({
  imports: [ScheduleModule.forRoot(), SlugGeneratorModule],
  providers: [ScheduledJobsApp],
})
export class ScheduledJobsModule {}
