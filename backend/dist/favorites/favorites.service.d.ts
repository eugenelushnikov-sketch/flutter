import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listForUser(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
        unit: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
            projectId: string;
        };
    } & {
        id: string;
        userId: string;
        unitId: string;
    })[]>;
    add(userId: string, unitId: string): Promise<{
        id: string;
        userId: string;
        unitId: string;
    }>;
    remove(userId: string, unitId: string): import("@prisma/client").Prisma.Prisma__FavoriteClient<{
        id: string;
        userId: string;
        unitId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
