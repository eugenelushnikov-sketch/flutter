import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService, @Inject('EMAIL_QUEUE') private readonly emailQueue: Queue) {}

  async create(fromUserId: string, unitId: string, message?: string) {
    const unit = await this.prisma.unit.findUnique({ where: { id: unitId }, include: { project: { include: { org: true } } } });
    if (!unit) throw new BadRequestException('Invalid unit');
    const toOrgId = unit.project.org.id;
    const inquiry = await this.prisma.inquiry.create({ data: { fromUserId, unitId, toOrgId, message } });
    await this.emailQueue.add('inquiry_notification', { inquiryId: inquiry.id, toOrgId });
    return inquiry;
  }

  inbox(orgId: string) {
    return this.prisma.inquiry.findMany({ where: { toOrgId: orgId }, include: { unit: true, fromUser: true } });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }
}