"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquiriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bullmq_1 = require("bullmq");
let InquiriesService = class InquiriesService {
    prisma;
    emailQueue;
    constructor(prisma, emailQueue) {
        this.prisma = prisma;
        this.emailQueue = emailQueue;
    }
    async create(fromUserId, unitId, message) {
        const unit = await this.prisma.unit.findUnique({ where: { id: unitId }, include: { project: { include: { org: true } } } });
        if (!unit)
            throw new common_1.BadRequestException('Invalid unit');
        const toOrgId = unit.project.org.id;
        const inquiry = await this.prisma.inquiry.create({ data: { fromUserId, unitId, toOrgId, message } });
        await this.emailQueue.add('inquiry_notification', { inquiryId: inquiry.id, toOrgId });
        return inquiry;
    }
    inbox(orgId) {
        return this.prisma.inquiry.findMany({ where: { toOrgId: orgId }, include: { unit: true, fromUser: true } });
    }
    updateStatus(id, status) {
        return this.prisma.inquiry.update({ where: { id }, data: { status } });
    }
};
exports.InquiriesService = InquiriesService;
exports.InquiriesService = InquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('EMAIL_QUEUE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, bullmq_1.Queue])
], InquiriesService);
//# sourceMappingURL=inquiries.service.js.map