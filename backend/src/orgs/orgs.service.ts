import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrgType, Prisma } from '@prisma/client';

@Injectable()
export class OrgsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.OrgCreateInput) {
    return this.prisma.org.create({ data });
  }

  findBySlug(slug: string) {
    return this.prisma.org.findUnique({ where: { slug }, include: { projects: true } });
  }

  findMany(type?: OrgType) {
    return this.prisma.org.findMany({ where: { type }, orderBy: { createdAt: 'desc' } });
  }

  update(id: string, data: Prisma.OrgUpdateInput, ownerUserId?: string) {
    // Ownership checks happen in controller with Roles
    return this.prisma.org.update({ where: { id }, data });
  }
}