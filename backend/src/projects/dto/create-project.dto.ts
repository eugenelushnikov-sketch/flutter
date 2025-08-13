import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  name!: string;
  @IsString()
  slug!: string;
  @IsString()
  orgId!: string;

  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsOptional()
  @IsString()
  city?: string;
  @IsOptional()
  @IsNumber()
  lat?: number;
  @IsOptional()
  @IsNumber()
  lng?: number;
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}