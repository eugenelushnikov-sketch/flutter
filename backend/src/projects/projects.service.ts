import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { md5 } from '../common/utils/hash';
import { Prisma, ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    @Inject('INDEXING_QUEUE') private readonly indexingQueue: Queue,
  ) {}

  async create(data: Prisma.ProjectCreateInput) {
    const project = await this.prisma.project.create({ data });
    await this.indexingQueue.add('project_index', { id: project.id });
    await this.cache.delByPattern('project:*');
    await this.cache.delByPattern('projects:list:*');
    return project;
  }

  async findBySlug(slug: string) {
    const key = `project:slug:${slug}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const project = await this.prisma.project.findUnique({ where: { slug }, include: { org: true, units: true, offices: true, news: true } });
    if (project) await this.cache.set(key, project, 300);
    return project;
  }

  async list(params: { city?: string; status?: ProjectStatus; offset?: number; limit?: number }) {
    const key = `projects:list:${md5(JSON.stringify(params))}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const where: Prisma.ProjectWhereInput = {};
    if (params.city) where.city = params.city;
    if (params.status) where.status = params.status;
    const items = await this.prisma.project.findMany({ where, skip: params.offset, take: params.limit, orderBy: { createdAt: 'desc' } });
    await this.cache.set(key, items, 120);
    return items;
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    const project = await this.prisma.project.update({ where: { id }, data });
    await this.indexingQueue.add('project_index', { id: project.id });
    await this.cache.delByPattern('project:*');
    await this.cache.delByPattern('projects:list:*');
    return project;
  }

  async remove(id: string) {
    const project = await this.prisma.project.delete({ where: { id } });
    await this.indexingQueue.add('project_remove', { id });
    await this.cache.delByPattern('project:*');
    await this.cache.delByPattern('projects:list:*');
    return project;
  }
}