import { Global, Module, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { IndexingProcessor } from './indexing.processor';
import { EmailProcessor } from './email.processor';

@Global()
@Module({
  providers: [
    {
      provide: 'BULLMQ_CONNECTION',
      useFactory: () => {
        const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
        return connection;
      },
    },
    {
      provide: 'INDEXING_QUEUE',
      useFactory: (connection: IORedis) => new Queue('indexingQueue', { connection }),
      inject: ['BULLMQ_CONNECTION'],
    },
    {
      provide: 'MEDIA_QUEUE',
      useFactory: (connection: IORedis) => new Queue('mediaQueue', { connection }),
      inject: ['BULLMQ_CONNECTION'],
    },
    {
      provide: 'EMAIL_QUEUE',
      useFactory: (connection: IORedis) => new Queue('emailQueue', { connection }),
      inject: ['BULLMQ_CONNECTION'],
    },
    IndexingProcessor,
    EmailProcessor,
  ],
  exports: ['INDEXING_QUEUE', 'MEDIA_QUEUE', 'EMAIL_QUEUE'],
})
export class QueueModule implements OnModuleInit {
  constructor() {}
  async onModuleInit() {}
}