import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class IndexingProcessor implements OnModuleInit {
  private readonly logger = new Logger(IndexingProcessor.name);
  private connection!: IORedis;

  constructor(private readonly prisma: PrismaService, private readonly search: SearchService) {}

  async onModuleInit() {
    this.connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
    new Worker(
      'indexingQueue',
      async (job) => {
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
              featuresText: (p.featuresJson as any)?.join?.(' ') || '',
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
              featuresText: (u.bulletJson as any)?.join?.(' ') || '',
            } as any;
            await this.search.indexUnit(doc);
          }
        }
        if (name === 'unit_remove') {
          await this.search.removeUnit(data.id);
        }
      },
      { connection: this.connection },
    );
    this.logger.log('Indexing worker started');
  }
}