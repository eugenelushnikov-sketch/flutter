import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Currency, ListingType } from '@prisma/client';

export class CreateUnitDto {
  @IsString()
  projectId!: string;
  @IsString()
  title!: string;
  @IsEnum(ListingType)
  listingType!: ListingType;

  @IsOptional() @IsInt() bedrooms?: number;
  @IsOptional() @IsInt() bathrooms?: number;
  @IsOptional() @IsNumber() areaSqm?: number;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsEnum(Currency) currency?: Currency;
  @IsOptional() @IsInt() floor?: number;
  @IsOptional() @IsBoolean() available?: boolean;
  @IsOptional() @IsString() shortDesc?: string;
  @IsOptional() @IsArray() mediaIds?: string[];
}