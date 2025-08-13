import { InquiriesService } from './inquiries.service';
export declare class InquiriesController {
    private readonly inquiries;
    constructor(inquiries: InquiriesService);
    create(req: any, dto: {
        unitId: string;
        message?: string;
    }): Promise<{
        id: string;
        message: string | null;
        status: string;
        createdAt: Date;
        fromUserId: string;
        unitId: string;
        toOrgId: string;
    }>;
    inbox(req: any): import("@prisma/client").Prisma.PrismaPromise<({
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
    update(id: string, dto: {
        status: string;
    }): import("@prisma/client").Prisma.Prisma__InquiryClient<{
        id: string;
        message: string | null;
        status: string;
        createdAt: Date;
        fromUserId: string;
        unitId: string;
        toOrgId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
