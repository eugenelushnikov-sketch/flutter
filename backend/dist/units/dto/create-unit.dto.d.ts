import { Currency, ListingType } from '@prisma/client';
export declare class CreateUnitDto {
    projectId: string;
    title: string;
    listingType: ListingType;
    bedrooms?: number;
    bathrooms?: number;
    areaSqm?: number;
    price?: number;
    currency?: Currency;
    floor?: number;
    available?: boolean;
    shortDesc?: string;
    mediaIds?: string[];
}
