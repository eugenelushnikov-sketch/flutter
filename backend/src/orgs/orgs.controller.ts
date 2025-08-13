import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { OrgType, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CacheService } from '../cache/cache.service';

@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgs: OrgsService, private readonly cache: CacheService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: Prisma.OrgCreateInput) {
    return this.orgs.create(dto);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const key = `org:slug:${slug}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const data = await this.orgs.findBySlug(slug);
    if (data) await this.cache.set(key, data, 300);
    return data;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DEVELOPER', 'COMPLEX')
  update(@Param('id') id: string, @Body() dto: Prisma.OrgUpdateInput) {
    return this.orgs.update(id, dto);
  }

  @Get()
  findMany(@Query('type') type?: OrgType) {
    return this.orgs.findMany(type);
  }
}