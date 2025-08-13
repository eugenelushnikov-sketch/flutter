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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const common_2 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const hash_1 = require("../common/utils/hash");
let ProjectsService = class ProjectsService {
    prisma;
    cache;
    indexingQueue;
    constructor(prisma, cache, indexingQueue) {
        this.prisma = prisma;
        this.cache = cache;
        this.indexingQueue = indexingQueue;
    }
    async create(data) {
        const project = await this.prisma.project.create({ data });
        await this.indexingQueue.add('project_index', { id: project.id });
        await this.cache.delByPattern('project:*');
        await this.cache.delByPattern('projects:list:*');
        return project;
    }
    async findBySlug(slug) {
        const key = `project:slug:${slug}`;
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const project = await this.prisma.project.findUnique({ where: { slug }, include: { org: true, units: true, offices: true, news: true } });
        if (project)
            await this.cache.set(key, project, 300);
        return project;
    }
    async list(params) {
        const key = `projects:list:${(0, hash_1.md5)(JSON.stringify(params))}`;
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const where = {};
        if (params.city)
            where.city = params.city;
        if (params.status)
            where.status = params.status;
        const items = await this.prisma.project.findMany({ where, skip: params.offset, take: params.limit, orderBy: { createdAt: 'desc' } });
        await this.cache.set(key, items, 120);
        return items;
    }
    async update(id, data) {
        const project = await this.prisma.project.update({ where: { id }, data });
        await this.indexingQueue.add('project_index', { id: project.id });
        await this.cache.delByPattern('project:*');
        await this.cache.delByPattern('projects:list:*');
        return project;
    }
    async remove(id) {
        const project = await this.prisma.project.delete({ where: { id } });
        await this.indexingQueue.add('project_remove', { id });
        await this.cache.delByPattern('project:*');
        await this.cache.delByPattern('projects:list:*');
        return project;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_2.Inject)('INDEXING_QUEUE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService,
        bullmq_1.Queue])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map