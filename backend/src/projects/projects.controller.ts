import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Prisma, ProjectStatus } from '@prisma/client';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DEVELOPER', 'COMPLEX')
  create(@Body() dto: Prisma.ProjectCreateInput) {
    return this.projects.create(dto);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.projects.findBySlug(slug);
  }

  @Get()
  list(@Query('city') city?: string, @Query('status') status?: ProjectStatus, @Query('offset') offset = '0', @Query('limit') limit = '20') {
    return this.projects.list({ city, status, offset: parseInt(offset, 10), limit: parseInt(limit, 10) });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DEVELOPER', 'COMPLEX')
  update(@Param('id') id: string, @Body() dto: Prisma.ProjectUpdateInput) {
    return this.projects.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.projects.remove(id);
  }
}