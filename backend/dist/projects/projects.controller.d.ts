import { ProjectsService } from './projects.service';
import { Prisma, ProjectStatus } from '@prisma/client';
export declare class ProjectsController {
    private readonly projects;
    constructor(projects: ProjectsService);
    create(dto: Prisma.ProjectCreateInput): Promise<{
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
    getBySlug(slug: string): Promise<any>;
    list(city?: string, status?: ProjectStatus, offset?: string, limit?: string): Promise<any>;
    update(id: string, dto: Prisma.ProjectUpdateInput): Promise<{
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
