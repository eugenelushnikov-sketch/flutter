import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('inquiries')
@UseGuards(JwtAuthGuard)
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: { unitId: string; message?: string }) {
    return this.inquiries.create(req.user.sub, dto.unitId, dto.message);
  }

  @Get('inbox')
  inbox(@Req() req: any) {
    // In real app: ensure user is owner of org; here assume orgId is passed as header for MVP
    const orgId = req.headers['x-org-id'] as string;
    return this.inquiries.inbox(orgId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.inquiries.updateStatus(id, dto.status);
  }
}