import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { md5 } from '../common/utils/hash';
import { Currency, ListingType, Prisma } from '@prisma/client';

@Injectable()
export class UnitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    @Inject('INDEXING_QUEUE') private readonly indexingQueue: Queue,
  ) {}

  private async validateBusinessRulesOnCreateOrUpdate(
    data: Prisma.UnitCreateInput | Prisma.UnitUpdateInput,
    whereProjectId?: string,
  ) {
    // Enforce: listingType = RENT only if parent project.org.type === COMPLEX
    // And: COMPLEX orgs cannot create SALE units
    const projectId = (data as any).project?.connect?.id || (data as any).projectId || whereProjectId;
    const listingType: ListingType | undefined = (data as any).listingType;
    if (!projectId || !listingType) return;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId as string },
      include: { org: true },
    });
    if (!project) throw new BadRequestException('Invalid project');

    if (listingType === ListingType.RENT && project.org.type !== 'COMPLEX') {
      throw new BadRequestException('RENT units are allowed only for COMPLEX org projects');
    }
    if (listingType === ListingType.SALE && project.org.type === 'COMPLEX') {
      throw new BadRequestException('COMPLEX org projects cannot list SALE units');
    }
  }

  async create(data: Prisma.UnitCreateInput) {
    await this.validateBusinessRulesOnCreateOrUpdate(data);
    const unit = await this.prisma.unit.create({ data });
    await this.indexingQueue.add('unit_index', { id: unit.id });
    await this.cache.delByPattern('unit:*');
    await this.cache.delByPattern('units:list:*');
    return unit;
  }

  async findById(id: string) {
    const key = `unit:${id}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const unit = await this.prisma.unit.findUnique({ where: { id }, include: { project: { include: { org: true } } } });
    if (unit) await this.cache.set(key, unit, 180);
    return unit;
  }

  async list(params: { listingType?: ListingType; priceFrom?: number; priceTo?: number; bedrooms?: number; city?: string; projectSlug?: string; offset?: number; limit?: number }) {
    const key = `units:list:${md5(JSON.stringify(params))}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const where: Prisma.UnitWhereInput = {};
    if (params.listingType) where.listingType = params.listingType;
    if (params.bedrooms !== undefined) where.bedrooms = params.bedrooms;
    if (params.city) where.project = { city: params.city };
    if (params.projectSlug) where.project = { slug: params.projectSlug } as any;
    if (params.priceFrom || params.priceTo) {
      where.price = {};
      if (params.priceFrom) (where.price as any).gte = new Prisma.Decimal(params.priceFrom);
      if (params.priceTo) (where.price as any).lte = new Prisma.Decimal(params.priceTo);
    }
    const items = await this.prisma.unit.findMany({ where, skip: params.offset, take: params.limit, orderBy: { createdAt: 'desc' } });
    await this.cache.set(key, items, 120);
    return items;
  }

  async update(id: string, data: Prisma.UnitUpdateInput) {
    // find project id for validation
    const existing = await this.prisma.unit.findUnique({ where: { id } });
    await this.validateBusinessRulesOnCreateOrUpdate(data, existing?.projectId);
    const unit = await this.prisma.unit.update({ where: { id }, data });
    await this.indexingQueue.add('unit_index', { id: unit.id });
    await this.cache.delByPattern(`unit:${id}`);
    await this.cache.delByPattern('units:list:*');
    return unit;
  }

  async remove(id: string) {
    const unit = await this.prisma.unit.delete({ where: { id } });
    await this.indexingQueue.add('unit_remove', { id });
    await this.cache.delByPattern(`unit:${id}`);
    await this.cache.delByPattern('units:list:*');
    return unit;
  }
}