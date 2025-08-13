import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';
export declare class InquiriesService {
    private readonly prisma;
    private readonly emailQueue;
    constructor(prisma: PrismaService, emailQueue: Queue);
    create(fromUserId: string, unitId: string, message?: string): Promise<{
        id: string;
        message: string | null;
        status: string;
        createdAt: Date;
        fromUserId: string;
        unitId: string;
        toOrgId: string;
    }>;
    inbox(orgId: string): import("@prisma/client").Prisma.PrismaPromise<({
        fromUser: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            passwordHash: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
        unit: {
            id: string;
            createdAt: Date;
            projectId: string;
            title: string;
            listingType: import("@prisma/client").$Enums.ListingType;
            bedrooms: number | null;
            bathrooms: number | null;
            areaSqm: number | null;
            price: import("@prisma/client/runtime/library").Decimal | null;
            currency: import("@prisma/client").$Enums.Currency | null;
            floor: number | null;
            available: boolean;
            shortDesc: string | null;
            bulletJson: import("@prisma/client/runtime/library").JsonValue | null;
            mediaIds: string[];
            updatedAt: Date;
        };
    } & {
        id: string;
        message: string | null;
        status: string;
        createdAt: Date;
        fromUserId: string;
        unitId: string;
        toOrgId: string;
    })[]>;
    updateStatus(id: string, status: string): import("@prisma/client").Prisma.Prisma__InquiryClient<{
        id: string;
        message: string | null;
        status: string;
        createdAt: Date;
        fromUserId: string;
        unitId: string;
        toOrgId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
