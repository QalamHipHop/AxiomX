import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class BotsService {
  private readonly logger = new Logger(BotsService.name);

  constructor(@InjectQueue('trading-bots') private botQueue: Queue) {}

  async createDCABot(config: any, userId: string) {
    const job = await this.botQueue.add('dca-trade', { config, userId }, {
      repeat: {
        pattern: config.cron || '0 * * * *', // Default every hour
      },
    });
    return job;
  }

  async createGridBot(config: any, userId: string) {
    // Grid bot logic
  }

  async stopBot(jobId: string) {
    const job = await this.botQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }
}
