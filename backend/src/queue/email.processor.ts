import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class EmailProcessor implements OnModuleInit {
  private readonly logger = new Logger(EmailProcessor.name);
  async onModuleInit() {
    const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
    new Worker(
      'emailQueue',
      async (job) => {
        this.logger.log(`Email job: ${job.name} -> ${JSON.stringify(job.data)}`);
      },
      { connection },
    );
    this.logger.log('Email worker started');
  }
}