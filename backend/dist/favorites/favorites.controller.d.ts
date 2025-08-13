import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favorites;
    constructor(favorites: FavoritesService);
    list(req: any): import("@prisma/client").Prisma.PrismaPromise<({
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
    add(req: any, unitId: string): Promise<{
        id: string;
        userId: string;
        unitId: string;
    }>;
    remove(req: any, unitId: string): import("@prisma/client").Prisma.Prisma__FavoriteClient<{
        id: string;
        userId: string;
        unitId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
