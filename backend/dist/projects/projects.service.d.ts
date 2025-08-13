import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { Queue } from 'bullmq';
import { Prisma, ProjectStatus } from '@prisma/client';
export declare class ProjectsService {
    private readonly prisma;
    private readonly cache;
    private readonly indexingQueue;
    constructor(prisma: PrismaService, cache: CacheService, indexingQueue: Queue);
    create(data: Prisma.ProjectCreateInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        city: string | null;
        address: string | null;
        lat: number | null;
        lng: number | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        deliveryAt: Date | null;
        heroId: string | null;
        featuresJson: Prisma.JsonValue | null;
        orgId: string;
    }>;
    findBySlug(slug: string): Promise<any>;
    list(params: {
        city?: string;
        status?: ProjectStatus;
        offset?: number;
        limit?: number;
    }): Promise<any>;
    update(id: string, data: Prisma.ProjectUpdateInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        city: string | null;
        address: string | null;
        lat: number | null;
        lng: number | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        deliveryAt: Date | null;
        heroId: string | null;
        featuresJson: Prisma.JsonValue | null;
        orgId: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        city: string | null;
        address: string | null;
        lat: number | null;
        lng: number | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        deliveryAt: Date | null;
        heroId: string | null;
        featuresJson: Prisma.JsonValue | null;
        orgId: string;
    }>;
}
