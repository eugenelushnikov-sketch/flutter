import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';

@Module({
  providers: [InquiriesService],
  controllers: [InquiriesController],
  exports: [InquiriesService],
})
export class InquiriesModule {}