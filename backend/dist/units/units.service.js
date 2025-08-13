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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const common_2 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const hash_1 = require("../common/utils/hash");
const client_1 = require("@prisma/client");
let UnitsService = class UnitsService {
    prisma;
    cache;
    indexingQueue;
    constructor(prisma, cache, indexingQueue) {
        this.prisma = prisma;
        this.cache = cache;
        this.indexingQueue = indexingQueue;
    }
    async validateBusinessRulesOnCreateOrUpdate(data, whereProjectId) {
        const projectId = data.project?.connect?.id || data.projectId || whereProjectId;
        const listingType = data.listingType;
        if (!projectId || !listingType)
            return;
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { org: true },
        });
        if (!project)
            throw new common_1.BadRequestException('Invalid project');
        if (listingType === client_1.ListingType.RENT && project.org.type !== 'COMPLEX') {
            throw new common_1.BadRequestException('RENT units are allowed only for COMPLEX org projects');
        }
        if (listingType === client_1.ListingType.SALE && project.org.type === 'COMPLEX') {
            throw new common_1.BadRequestException('COMPLEX org projects cannot list SALE units');
        }
    }
    async create(data) {
        await this.validateBusinessRulesOnCreateOrUpdate(data);
        const unit = await this.prisma.unit.create({ data });
        await this.indexingQueue.add('unit_index', { id: unit.id });
        await this.cache.delByPattern('unit:*');
        await this.cache.delByPattern('units:list:*');
        return unit;
    }
    async findById(id) {
        const key = `unit:${id}`;
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const unit = await this.prisma.unit.findUnique({ where: { id }, include: { project: { include: { org: true } } } });
        if (unit)
            await this.cache.set(key, unit, 180);
        return unit;
    }
    async list(params) {
        const key = `units:list:${(0, hash_1.md5)(JSON.stringify(params))}`;
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const where = {};
        if (params.listingType)
            where.listingType = params.listingType;
        if (params.bedrooms !== undefined)
            where.bedrooms = params.bedrooms;
        if (params.city)
            where.project = { city: params.city };
        if (params.projectSlug)
            where.project = { slug: params.projectSlug };
        if (params.priceFrom || params.priceTo) {
            where.price = {};
            if (params.priceFrom)
                where.price.gte = new client_1.Prisma.Decimal(params.priceFrom);
            if (params.priceTo)
                where.price.lte = new client_1.Prisma.Decimal(params.priceTo);
        }
        const items = await this.prisma.unit.findMany({ where, skip: params.offset, take: params.limit, orderBy: { createdAt: 'desc' } });
        await this.cache.set(key, items, 120);
        return items;
    }
    async update(id, data) {
        const existing = await this.prisma.unit.findUnique({ where: { id } });
        await this.validateBusinessRulesOnCreateOrUpdate(data, existing?.projectId);
        const unit = await this.prisma.unit.update({ where: { id }, data });
        await this.indexingQueue.add('unit_index', { id: unit.id });
        await this.cache.delByPattern(`unit:${id}`);
        await this.cache.delByPattern('units:list:*');
        return unit;
    }
    async remove(id) {
        const unit = await this.prisma.unit.delete({ where: { id } });
        await this.indexingQueue.add('unit_remove', { id });
        await this.cache.delByPattern(`unit:${id}`);
        await this.cache.delByPattern('units:list:*');
        return unit;
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_2.Inject)('INDEXING_QUEUE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService,
        bullmq_1.Queue])
], UnitsService);
//# sourceMappingURL=units.service.js.map