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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var IndexingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexingProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma_service_1 = require("../prisma/prisma.service");
const search_service_1 = require("../search/search.service");
let IndexingProcessor = IndexingProcessor_1 = class IndexingProcessor {
    prisma;
    search;
    logger = new common_1.Logger(IndexingProcessor_1.name);
    connection;
    constructor(prisma, search) {
        this.prisma = prisma;
        this.search = search;
    }
    async onModuleInit() {
        this.connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
        new bullmq_1.Worker('indexingQueue', async (job) => {
            const { name, data } = job;
            if (name === 'project_index') {
                const p = await this.prisma.project.findUnique({ where: { id: data.id }, include: { org: true } });
                if (p) {
                    const doc = {
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        city: p.city,
                        status: p.status,
                        featuresText: p.featuresJson?.join?.(' ') || '',
                        orgName: p.org.name,
                    };
                    await this.search.indexProject(doc);
                }
            }
            if (name === 'project_remove') {
                await this.search.removeProject(data.id);
            }
            if (name === 'unit_index') {
                const u = await this.prisma.unit.findUnique({ where: { id: data.id }, include: { project: true } });
                if (u) {
                    const doc = {
                        id: u.id,
                        projectSlug: u.project.slug,
                        title: u.title,
                        listingType: u.listingType,
                        bedrooms: u.bedrooms,
                        bathrooms: u.bathrooms,
                        areaSqm: u.areaSqm,
                        price: u.price?.toNumber?.() ?? null,
                        currency: u.currency,
                        city: u.project.city,
                        featuresText: u.bulletJson?.join?.(' ') || '',
                    };
                    await this.search.indexUnit(doc);
                }
            }
            if (name === 'unit_remove') {
                await this.search.removeUnit(data.id);
            }
        }, { connection: this.connection });
        this.logger.log('Indexing worker started');
    }
};
exports.IndexingProcessor = IndexingProcessor;
exports.IndexingProcessor = IndexingProcessor = IndexingProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, search_service_1.SearchService])
], IndexingProcessor);
//# sourceMappingURL=indexing.processor.js.map