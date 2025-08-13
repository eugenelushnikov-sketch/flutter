import { ProjectStatus } from '@prisma/client';
export declare class CreateProjectDto {
    name: string;
    slug: string;
    orgId: string;
    description?: string;
    address?: string;
    city?: string;
    lat?: number;
    lng?: number;
    status?: ProjectStatus;
}
