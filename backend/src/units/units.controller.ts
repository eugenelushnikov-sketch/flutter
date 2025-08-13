import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ListingType } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller('units')
export class UnitsController {
  constructor(private readonly units: UnitsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DEVELOPER', 'COMPLEX')
  create(@Body() dto: Prisma.UnitCreateInput) {
    return this.units.create(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.units.findById(id);
  }

  @Get()
  list(
    @Query('listingType') listingType?: ListingType,
    @Query('priceFrom') priceFrom?: string,
    @Query('priceTo') priceTo?: string,
    @Query('bedrooms') bedrooms?: string,
    @Query('city') city?: string,
    @Query('projectSlug') projectSlug?: string,
    @Query('offset') offset: string = '0',
    @Query('limit') limit: string = '20',
  ) {
    return this.units.list({
      listingType,
      priceFrom: priceFrom ? parseFloat(priceFrom) : undefined,
      priceTo: priceTo ? parseFloat(priceTo) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
      city,
      projectSlug,
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DEVELOPER', 'COMPLEX')
  update(@Param('id') id: string, @Body() dto: Prisma.UnitUpdateInput) {
    return this.units.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.units.remove(id);
  }
}