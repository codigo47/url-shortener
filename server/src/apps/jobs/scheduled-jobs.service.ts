import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SlugGeneratorSystem } from '../../systems/slug-generator.ts/slug-generator.service';

@Injectable()
export class ScheduledJobsApp {
  private readonly logger = new Logger(ScheduledJobsApp.name);

  constructor(private readonly slugGeneratorSystem: SlugGeneratorSystem) {}

  @Cron('*/10 * * * * *') // Runs every 10 seconds
  async handleCron() {
    try {
      await this.slugGeneratorSystem.generateSlugsAndAddToPool();
    } catch (error) {
      this.logger.error('Error in scheduled job:', error);
    }
  }
}
